import sqlite3
import pandas as pd


def load_data(db_path: str = "data/olist_mart.db") -> pd.DataFrame:
    conn = sqlite3.connect(db_path)
    df = pd.read_sql_query(
        """
        SELECT
            f.order_id,
            f.order_purchase_timestamp,
            f.order_status,
            f.price,
            f.freight_value,
            f.payment_value,
            f.distance_km,
            f.delivery_delay_days,
            p.product_category_name_english,
            c.customer_state
        FROM fact_orders f
        JOIN dim_products  p ON f.product_id  = p.product_id
        JOIN dim_customers c ON f.customer_id = c.customer_id
        """,
        conn,
        parse_dates=["order_purchase_timestamp"],
    )
    conn.close()
    return df
