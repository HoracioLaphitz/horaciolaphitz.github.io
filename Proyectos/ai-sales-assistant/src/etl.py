import os
import sqlite3
import numpy as np
import pandas as pd


def _haversine(lat1: np.ndarray, lon1: np.ndarray, lat2: np.ndarray, lon2: np.ndarray) -> np.ndarray:
    R = 6371.0
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat / 2) ** 2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2) ** 2
    return 2 * R * np.arcsin(np.sqrt(a))


def build_mart(data_dir: str = "data", db_path: str = "data/olist_mart.db") -> None:
    # 1. Read CSVs
    orders = pd.read_csv(
        os.path.join(data_dir, "olist_orders_dataset.csv"),
        parse_dates=[
            "order_purchase_timestamp",
            "order_delivered_customer_date",
            "order_estimated_delivery_date",
        ],
    )
    items = pd.read_csv(os.path.join(data_dir, "olist_order_items_dataset.csv"))
    products = pd.read_csv(os.path.join(data_dir, "olist_products_dataset.csv"))
    translation = pd.read_csv(os.path.join(data_dir, "product_category_name_translation.csv"))
    payments = pd.read_csv(os.path.join(data_dir, "olist_order_payments_dataset.csv"))
    customers = pd.read_csv(os.path.join(data_dir, "olist_customers_dataset.csv"))
    sellers = pd.read_csv(os.path.join(data_dir, "olist_sellers_dataset.csv"))
    geo = pd.read_csv(os.path.join(data_dir, "olist_geolocation_dataset.csv"))

    # 2. Geo centroids: mean lat/lng per ZIP prefix
    geo_centroids = (
        geo.groupby("geolocation_zip_code_prefix")[["geolocation_lat", "geolocation_lng"]]
        .mean()
        .reset_index()
        .rename(columns={
            "geolocation_zip_code_prefix": "zip",
            "geolocation_lat": "lat",
            "geolocation_lng": "lng",
        })
    )

    # 3. Dimension tables
    cust_geo = customers.merge(
        geo_centroids, left_on="customer_zip_code_prefix", right_on="zip", how="left"
    )
    dim_customers = cust_geo[["customer_id", "customer_state", "customer_city", "lat", "lng"]]

    sell_geo = sellers.merge(
        geo_centroids, left_on="seller_zip_code_prefix", right_on="zip", how="left"
    )
    dim_sellers = sell_geo[["seller_id", "seller_state", "seller_city", "lat", "lng"]]

    prods = products.merge(translation, on="product_category_name", how="left")
    has_weight = "product_weight_g" in prods.columns
    if has_weight:
        volume = prods["product_length_cm"] * prods["product_height_cm"] * prods["product_width_cm"]
        dim_products = prods.assign(weight_g=prods["product_weight_g"], volume_cm3=volume)[
            ["product_id", "product_category_name_english", "weight_g", "volume_cm3"]
        ]
    else:
        dim_products = prods[["product_id", "product_category_name_english"]].assign(
            weight_g=None, volume_cm3=None
        )

    # 4. Aggregate items per order (first product/seller, sum price/freight)
    items_agg = (
        items.groupby("order_id")
        .agg(
            price=("price", "sum"),
            freight_value=("freight_value", "sum"),
            product_id=("product_id", "first"),
            seller_id=("seller_id", "first"),
        )
        .reset_index()
    )

    payments_agg = payments.groupby("order_id")["payment_value"].sum().reset_index()

    # 5. Build fact table (delivered orders only)
    delivered = orders[orders["order_status"] == "delivered"].copy()
    fact = (
        delivered
        .merge(items_agg, on="order_id", how="left")
        .merge(payments_agg, on="order_id", how="left")
    )

    # 6. Delivery delay in days (negative = early, positive = late)
    fact["delivery_delay_days"] = (
        (fact["order_delivered_customer_date"] - fact["order_estimated_delivery_date"])
        .dt.total_seconds() / 86400
    )

    # 7. Haversine distance seller -> customer
    fact = (
        fact
        .merge(
            cust_geo[["customer_id", "lat", "lng"]].rename(columns={"lat": "c_lat", "lng": "c_lng"}),
            on="customer_id",
            how="left",
        )
        .merge(
            sell_geo[["seller_id", "lat", "lng"]].rename(columns={"lat": "s_lat", "lng": "s_lng"}),
            on="seller_id",
            how="left",
        )
    )
    fact["distance_km"] = _haversine(
        fact["c_lat"].values,
        fact["c_lng"].values,
        fact["s_lat"].values,
        fact["s_lng"].values,
    )

    # 8. dim_date
    ts = delivered["order_purchase_timestamp"].dropna()
    dim_date = pd.DataFrame({
        "date_id": ts.dt.strftime("%Y-%m-%d"),
        "year": ts.dt.year,
        "month": ts.dt.month,
        "quarter": ts.dt.quarter,
        "day_of_week": ts.dt.dayofweek,
    }).drop_duplicates("date_id")

    # 9. Write to SQLite
    parent = os.path.dirname(db_path)
    if parent:
        os.makedirs(parent, exist_ok=True)

    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.executescript("""
        DROP TABLE IF EXISTS fact_orders;
        DROP TABLE IF EXISTS dim_customers;
        DROP TABLE IF EXISTS dim_sellers;
        DROP TABLE IF EXISTS dim_products;
        DROP TABLE IF EXISTS dim_date;

        CREATE TABLE dim_date (
            date_id TEXT PRIMARY KEY,
            year INTEGER,
            month INTEGER,
            quarter INTEGER,
            day_of_week INTEGER
        );
        CREATE TABLE dim_customers (
            customer_id TEXT PRIMARY KEY,
            customer_state TEXT,
            customer_city TEXT,
            lat REAL,
            lng REAL
        );
        CREATE TABLE dim_sellers (
            seller_id TEXT PRIMARY KEY,
            seller_state TEXT,
            seller_city TEXT,
            lat REAL,
            lng REAL
        );
        CREATE TABLE dim_products (
            product_id TEXT PRIMARY KEY,
            product_category_name_english TEXT,
            weight_g REAL,
            volume_cm3 REAL
        );
        CREATE TABLE fact_orders (
            order_id TEXT,
            customer_id TEXT,
            seller_id TEXT,
            product_id TEXT,
            date_id TEXT,
            price REAL,
            freight_value REAL,
            payment_value REAL,
            distance_km REAL,
            delivery_delay_days REAL,
            order_status TEXT,
            order_purchase_timestamp TEXT
        );
        CREATE INDEX idx_fact_seller   ON fact_orders(seller_id);
        CREATE INDEX idx_fact_customer ON fact_orders(customer_id);
        CREATE INDEX idx_fact_date     ON fact_orders(date_id);
        CREATE INDEX idx_fact_product  ON fact_orders(product_id);
    """)

    cur = conn.cursor()

    cur.executemany(
        "INSERT INTO dim_date VALUES (?,?,?,?,?)",
        dim_date[["date_id", "year", "month", "quarter", "day_of_week"]].itertuples(index=False, name=None),
    )
    cur.executemany(
        "INSERT INTO dim_customers VALUES (?,?,?,?,?)",
        dim_customers[["customer_id", "customer_state", "customer_city", "lat", "lng"]].itertuples(index=False, name=None),
    )
    cur.executemany(
        "INSERT INTO dim_sellers VALUES (?,?,?,?,?)",
        dim_sellers[["seller_id", "seller_state", "seller_city", "lat", "lng"]].itertuples(index=False, name=None),
    )
    cur.executemany(
        "INSERT INTO dim_products VALUES (?,?,?,?)",
        dim_products[["product_id", "product_category_name_english", "weight_g", "volume_cm3"]].itertuples(index=False, name=None),
    )

    fact["date_id"] = fact["order_purchase_timestamp"].dt.strftime("%Y-%m-%d")
    fact_rows = fact[[
        "order_id", "customer_id", "seller_id", "product_id", "date_id",
        "price", "freight_value", "payment_value",
        "distance_km", "delivery_delay_days",
        "order_status", "order_purchase_timestamp",
    ]].copy()
    fact_rows["order_purchase_timestamp"] = fact_rows["order_purchase_timestamp"].astype(str)

    cur.executemany(
        "INSERT INTO fact_orders VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
        fact_rows.itertuples(index=False, name=None),
    )

    conn.commit()
    conn.close()


if __name__ == "__main__":
    build_mart()
    print("Data mart built: data/olist_mart.db")
