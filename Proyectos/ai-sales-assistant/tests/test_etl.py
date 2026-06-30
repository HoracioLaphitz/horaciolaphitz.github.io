import os
import sqlite3
import pytest

FIXTURES = os.path.join(os.path.dirname(__file__), "fixtures")


@pytest.fixture
def tmp_db(tmp_path):
    return str(tmp_path / "test.db")


def test_build_mart_creates_db(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    assert os.path.exists(tmp_db)


def test_build_mart_creates_all_tables(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    tables = {r[0] for r in conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table'"
    ).fetchall()}
    conn.close()
    assert tables == {"fact_orders", "dim_customers", "dim_sellers", "dim_products", "dim_date"}


def test_fact_orders_excludes_canceled(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    count = conn.execute("SELECT COUNT(*) FROM fact_orders").fetchone()[0]
    conn.close()
    assert count == 2  # o1 and o2 only; o3 is canceled


def test_fact_orders_has_distance_km(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    rows = {r[0]: r[1] for r in conn.execute(
        "SELECT order_id, distance_km FROM fact_orders ORDER BY order_id"
    ).fetchall()}
    conn.close()
    assert rows["o1"] is not None and rows["o1"] > 0
    assert rows["o2"] is not None and rows["o2"] > 0
    assert rows["o1"] < rows["o2"]  # SP-to-SP < RJ-to-SP


def test_fact_orders_has_delivery_delay(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    rows = {r[0]: r[1] for r in conn.execute(
        "SELECT order_id, delivery_delay_days FROM fact_orders ORDER BY order_id"
    ).fetchall()}
    conn.close()
    assert rows["o1"] == pytest.approx(-5.0)   # delivered 5 days early
    assert rows["o2"] == pytest.approx(5.0)    # delivered 5 days late


def test_dim_customers_has_lat_lng(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    row = conn.execute(
        "SELECT lat, lng FROM dim_customers WHERE customer_id='c1'"
    ).fetchone()
    conn.close()
    assert row is not None
    assert row[0] == pytest.approx(-23.5505, abs=0.01)
    assert row[1] == pytest.approx(-46.6333, abs=0.01)


def test_indexes_exist(tmp_db):
    from src.etl import build_mart
    build_mart(data_dir=FIXTURES, db_path=tmp_db)
    conn = sqlite3.connect(tmp_db)
    indexes = {r[0] for r in conn.execute(
        "SELECT name FROM sqlite_master WHERE type='index'"
    ).fetchall()}
    conn.close()
    assert "idx_fact_seller" in indexes
    assert "idx_fact_date" in indexes
