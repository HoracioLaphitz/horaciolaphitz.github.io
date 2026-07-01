import os
import sqlite3
import numpy as np
import pandas as pd

SQL_DIR = os.path.join(os.path.dirname(__file__), "..", "sql")

_CSV_TO_RAW = {
    "olist_orders_dataset.csv": "raw_orders",
    "olist_order_items_dataset.csv": "raw_order_items",
    "olist_products_dataset.csv": "raw_products",
    "product_category_name_translation.csv": "raw_category_translation",
    "olist_order_payments_dataset.csv": "raw_payments",
    "olist_customers_dataset.csv": "raw_customers",
    "olist_sellers_dataset.csv": "raw_sellers",
    "olist_geolocation_dataset.csv": "raw_geolocation",
    "olist_order_reviews_dataset.csv": "raw_reviews",
}


def _haversine(lat1, lon1, lat2, lon2):
    R = 6371.0
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat, dlon = lat2 - lat1, lon2 - lon1
    a = np.sin(dlat / 2) ** 2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2) ** 2
    return 2 * R * np.arcsin(np.sqrt(a))


def _run_sql(conn: sqlite3.Connection, filename: str) -> None:
    with open(os.path.join(SQL_DIR, filename), "r", encoding="utf-8") as f:
        conn.executescript(f.read())


def _ingest_raw(conn: sqlite3.Connection, data_dir: str) -> None:
    for csv_name, table in _CSV_TO_RAW.items():
        df = pd.read_csv(os.path.join(data_dir, csv_name))
        df.to_sql(table, conn, if_exists="replace", index=False)


def build_mart(data_dir: str = "data", db_path: str = "data/olist_mart.db") -> None:
    parent = os.path.dirname(db_path)
    if parent:
        os.makedirs(parent, exist_ok=True)

    conn = sqlite3.connect(db_path)
    try:
        conn.execute("PRAGMA journal_mode=WAL")
        _ingest_raw(conn, data_dir)
        _run_sql(conn, "clean.sql")
        conn.commit()
    finally:
        conn.close()


if __name__ == "__main__":
    build_mart()
    print("Data mart built: data/olist_mart.db")
