import os
import tempfile
import pytest
import pandas as pd
from datetime import datetime

FIXTURES = os.path.join(os.path.dirname(__file__), "fixtures")


@pytest.fixture
def sample_df():
    """One row per order — matches load_data() output after SQLite refactor.

    payment_value sum = 638, order_id.nunique() = 3 — identical to previous fixture totals.
    """
    return pd.DataFrame({
        "order_id": ["o1", "o2", "o3"],
        "order_purchase_timestamp": [
            datetime(2018, 1, 15),
            datetime(2018, 3, 10),
            datetime(2018, 6, 5),
        ],
        "order_status": ["delivered", "delivered", "delivered"],
        "price": [150.0, 280.0, 150.0],
        "freight_value": [15.0, 28.0, 15.0],
        "payment_value": [165.0, 308.0, 165.0],
        "product_category_name_english": ["electronics", "electronics", "books"],
        "customer_state": ["SP", "RJ", "MG"],
        "distance_km": [9.0, 368.0, 430.0],
        "delivery_delay_days": [-5.0, 5.0, 0.0],
    })


@pytest.fixture(scope="session")
def test_db_path():
    """SQLite Data Mart built from fixture CSVs — created once per test session."""
    from src.etl import build_mart

    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as f:
        db = f.name
    build_mart(data_dir=FIXTURES, db_path=db)
    yield db
    os.unlink(db)
