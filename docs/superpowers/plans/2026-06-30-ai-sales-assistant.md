# AI Sales Assistant — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Streamlit app que analiza 100k+ órdenes de Olist Brazil con LangChain + Groq llama3-70b — dashboard automático de KPIs + chat en lenguaje natural sobre datos de ventas.

**Architecture:** `loader.py` mergea 5 CSVs de Olist en un DataFrame principal; `analysis.py` calcula KPIs y genera charts Plotly; `agent.py` construye un LangChain Pandas DataFrame Agent sobre ese mismo DataFrame; `app.py` orquesta los 3 módulos en 2 tabs de Streamlit.

**Tech Stack:** Python 3.11+, Streamlit 1.35+, LangChain 0.2+, langchain-experimental, langchain-groq, Groq API (llama3-70b-8192), Pandas 2.2+, Plotly 5.22+, pytest 8+, python-dotenv.

## Global Constraints

- Todos los archivos Python en `Proyectos/ai-sales-assistant/`
- Tests en `Proyectos/ai-sales-assistant/tests/` con pytest
- Dataset CSVs en `Proyectos/ai-sales-assistant/data/` (gitignored — usuario descarga de Kaggle)
- Portfolio entry en `src/content/proyectos/ai-sales-assistant.md`
- API key Groq nunca se commitea — solo en `.env` (gitignored) o Streamlit Cloud secrets
- Imports absolutos desde raíz del proyecto (`from src.loader import load_data`)
- Funciones de charts retornan `go.Figure`, nunca llaman `st.plotly_chart` directamente
- `run_analysis()` retorna `dict` — nunca tiene side effects de UI
- DataFrame principal filtrado a `order_status == "delivered"` únicamente

---

### Task 1: Scaffold — estructura, dependencias, fixtures de tests

**Files:**
- Create: `Proyectos/ai-sales-assistant/requirements.txt`
- Create: `Proyectos/ai-sales-assistant/.env.example`
- Create: `Proyectos/ai-sales-assistant/data/.gitkeep`
- Create: `Proyectos/ai-sales-assistant/src/__init__.py`
- Create: `Proyectos/ai-sales-assistant/tests/__init__.py`
- Create: `Proyectos/ai-sales-assistant/tests/conftest.py`

**Interfaces:**
- Produces: fixture `sample_df` disponible para todos los tests del proyecto

- [ ] **Step 1: Crear directorios**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26"
mkdir -p Proyectos/ai-sales-assistant/data
mkdir -p Proyectos/ai-sales-assistant/src
mkdir -p Proyectos/ai-sales-assistant/tests
```

- [ ] **Step 2: Crear `requirements.txt`**

```
streamlit>=1.35.0
langchain>=0.2.0
langchain-experimental>=0.0.60
langchain-groq>=0.1.5
groq>=0.9.0
pandas>=2.2.0
plotly>=5.22.0
python-dotenv>=1.0.0
pytest>=8.2.0
pytest-mock>=3.14.0
```

- [ ] **Step 3: Crear `.env.example`**

```
GROQ_API_KEY=your_groq_api_key_here
```

- [ ] **Step 4: Crear `src/__init__.py` y `tests/__init__.py`**

Ambos vacíos.

- [ ] **Step 5: Crear `tests/conftest.py`** con fixture del DataFrame principal

```python
import pytest
import pandas as pd
from datetime import datetime


@pytest.fixture
def sample_df():
    """DataFrame con el schema exacto que produce load_data()."""
    return pd.DataFrame({
        "order_id": ["o1", "o1", "o2", "o2", "o3"],
        "order_purchase_timestamp": [
            datetime(2018, 1, 15),
            datetime(2018, 1, 15),
            datetime(2018, 3, 10),
            datetime(2018, 3, 10),
            datetime(2018, 6, 5),
        ],
        "order_status": ["delivered", "delivered", "delivered", "delivered", "delivered"],
        "price": [100.0, 50.0, 200.0, 80.0, 150.0],
        "freight_value": [10.0, 5.0, 20.0, 8.0, 15.0],
        "payment_value": [110.0, 55.0, 220.0, 88.0, 165.0],
        "product_category_name_english": [
            "electronics", "books", "electronics", "furniture", "books"
        ],
        "customer_state": ["SP", "RJ", "SP", "MG", "RJ"],
    })
```

- [ ] **Step 6: Crear `data/.gitkeep`**

```bash
touch "Proyectos/ai-sales-assistant/data/.gitkeep"
```

- [ ] **Step 7: Verificar estructura**

```bash
cd "Proyectos/ai-sales-assistant"
python -m pytest tests/ --collect-only 2>&1 | head -5
```

Esperado: `no tests ran` (aún no hay tests, pero pytest corre sin error).

- [ ] **Step 8: Instalar dependencias**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26/Proyectos/ai-sales-assistant"
pip install -r requirements.txt
```

- [ ] **Step 9: Commit**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26"
git add Proyectos/ai-sales-assistant/
git commit -m "feat(ai-sales-assistant): scaffold project structure and test fixtures"
```

---

### Task 2: loader.py — merge de 5 tablas Olist

**Files:**
- Create: `Proyectos/ai-sales-assistant/src/loader.py`
- Create: `Proyectos/ai-sales-assistant/tests/fixtures/` (CSVs mínimos)
- Create: `Proyectos/ai-sales-assistant/tests/test_loader.py`

**Interfaces:**
- Consumes: 5 CSVs en `data/`
- Produces: `load_data(data_dir: str) -> pd.DataFrame` con columnas: `order_id`, `order_purchase_timestamp`, `order_status`, `price`, `freight_value`, `payment_value`, `product_category_name_english`, `customer_state`

- [ ] **Step 1: Crear fixtures CSV mínimas**

```bash
mkdir -p "Proyectos/ai-sales-assistant/tests/fixtures"
```

Crear `tests/fixtures/olist_orders_dataset.csv`:
```csv
order_id,customer_id,order_status,order_purchase_timestamp
o1,c1,delivered,2018-01-15 10:00:00
o2,c2,delivered,2018-03-10 14:00:00
o3,c3,canceled,2018-06-05 09:00:00
```

Crear `tests/fixtures/olist_order_items_dataset.csv`:
```csv
order_id,order_item_id,product_id,seller_id,price,freight_value
o1,1,p1,s1,100.0,10.0
o2,1,p2,s1,200.0,20.0
o3,1,p1,s2,150.0,15.0
```

Crear `tests/fixtures/olist_products_dataset.csv`:
```csv
product_id,product_category_name
p1,eletronicos
p2,moveis_decoracao
```

Crear `tests/fixtures/olist_product_category_name_translation.csv`:
```csv
product_category_name,product_category_name_english
eletronicos,electronics
moveis_decoracao,furniture
```

Crear `tests/fixtures/olist_order_payments_dataset.csv`:
```csv
order_id,payment_sequential,payment_type,payment_installments,payment_value
o1,1,credit_card,1,110.0
o2,1,credit_card,1,220.0
o3,1,boleto,1,165.0
```

Crear `tests/fixtures/olist_customers_dataset.csv`:
```csv
customer_id,customer_unique_id,customer_zip_code_prefix,customer_city,customer_state
c1,u1,01000,sao paulo,SP
c2,u2,20000,rio de janeiro,RJ
c3,u3,30000,belo horizonte,MG
```

- [ ] **Step 2: Escribir tests**

`tests/test_loader.py`:
```python
import pytest
import os
from src.loader import load_data

FIXTURES = os.path.join(os.path.dirname(__file__), "fixtures")


def test_load_data_returns_dataframe():
    df = load_data(FIXTURES)
    assert df is not None
    assert len(df) > 0


def test_load_data_filters_delivered_only():
    df = load_data(FIXTURES)
    assert (df["order_status"] == "delivered").all()


def test_load_data_has_required_columns():
    df = load_data(FIXTURES)
    required = {
        "order_id", "order_purchase_timestamp", "order_status",
        "price", "freight_value", "payment_value",
        "product_category_name_english", "customer_state",
    }
    assert required.issubset(set(df.columns))


def test_load_data_parses_timestamps():
    df = load_data(FIXTURES)
    import pandas as pd
    assert pd.api.types.is_datetime64_any_dtype(df["order_purchase_timestamp"])


def test_load_data_payment_value_numeric():
    df = load_data(FIXTURES)
    assert df["payment_value"].dtype in ["float64", "float32"]
```

- [ ] **Step 3: Correr tests — verificar que fallan**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26/Proyectos/ai-sales-assistant"
python -m pytest tests/test_loader.py -v 2>&1 | head -20
```

Esperado: `ImportError` o `ModuleNotFoundError` (loader no existe aún).

- [ ] **Step 4: Implementar `src/loader.py`**

```python
import os
import pandas as pd


def load_data(data_dir: str = "data") -> pd.DataFrame:
    orders = pd.read_csv(os.path.join(data_dir, "olist_orders_dataset.csv"),
                         parse_dates=["order_purchase_timestamp"])
    items = pd.read_csv(os.path.join(data_dir, "olist_order_items_dataset.csv"))
    products = pd.read_csv(os.path.join(data_dir, "olist_products_dataset.csv"))
    translation = pd.read_csv(os.path.join(data_dir, "olist_product_category_name_translation.csv"))
    payments = pd.read_csv(os.path.join(data_dir, "olist_order_payments_dataset.csv"))
    customers = pd.read_csv(os.path.join(data_dir, "olist_customers_dataset.csv"))

    products = products.merge(translation, on="product_category_name", how="left")

    payments_agg = (
        payments.groupby("order_id")["payment_value"].sum().reset_index()
    )

    items_agg = (
        items.groupby("order_id")
        .agg(price=("price", "sum"), freight_value=("freight_value", "sum"), product_id=("product_id", "first"))
        .reset_index()
    )

    df = (
        orders[orders["order_status"] == "delivered"]
        .merge(items_agg, on="order_id", how="left")
        .merge(products[["product_id", "product_category_name_english"]], on="product_id", how="left")
        .merge(payments_agg, on="order_id", how="left")
        .merge(customers[["customer_id", "customer_state"]], on="customer_id", how="left")
    )

    return df[[
        "order_id", "order_purchase_timestamp", "order_status",
        "price", "freight_value", "payment_value",
        "product_category_name_english", "customer_state",
    ]].reset_index(drop=True)
```

- [ ] **Step 5: Correr tests — verificar que pasan**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26/Proyectos/ai-sales-assistant"
python -m pytest tests/test_loader.py -v
```

Esperado: `5 passed`.

- [ ] **Step 6: Commit**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26"
git add Proyectos/ai-sales-assistant/src/loader.py \
        Proyectos/ai-sales-assistant/tests/test_loader.py \
        Proyectos/ai-sales-assistant/tests/fixtures/
git commit -m "feat(ai-sales-assistant): data loader with Olist merge pipeline"
```

---

### Task 3: charts.py — helpers Plotly

**Files:**
- Create: `Proyectos/ai-sales-assistant/src/charts.py`
- Create: `Proyectos/ai-sales-assistant/tests/test_charts.py`

**Interfaces:**
- Consumes: `sample_df` fixture (de conftest.py)
- Produces:
  - `bar_chart(df, x, y, title) -> go.Figure`
  - `line_chart(df, x, y, title) -> go.Figure`
  - `choropleth_brazil(df, state_col, value_col, title) -> go.Figure`

- [ ] **Step 1: Escribir tests**

`tests/test_charts.py`:
```python
import pytest
import pandas as pd
import plotly.graph_objects as go
from src.charts import bar_chart, line_chart, choropleth_brazil


def test_bar_chart_returns_figure(sample_df):
    top = sample_df.groupby("product_category_name_english")["payment_value"].sum().reset_index()
    fig = bar_chart(top, x="product_category_name_english", y="payment_value", title="Test")
    assert isinstance(fig, go.Figure)


def test_bar_chart_has_data(sample_df):
    top = sample_df.groupby("product_category_name_english")["payment_value"].sum().reset_index()
    fig = bar_chart(top, x="product_category_name_english", y="payment_value", title="Test")
    assert len(fig.data) > 0


def test_line_chart_returns_figure(sample_df):
    monthly = sample_df.copy()
    monthly["month"] = monthly["order_purchase_timestamp"].dt.to_period("M").astype(str)
    agg = monthly.groupby("month")["payment_value"].sum().reset_index()
    fig = line_chart(agg, x="month", y="payment_value", title="Monthly")
    assert isinstance(fig, go.Figure)


def test_choropleth_returns_figure(sample_df):
    by_state = sample_df.groupby("customer_state")["payment_value"].sum().reset_index()
    fig = choropleth_brazil(by_state, state_col="customer_state", value_col="payment_value", title="States")
    assert isinstance(fig, go.Figure)
```

- [ ] **Step 2: Correr tests — verificar que fallan**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26/Proyectos/ai-sales-assistant"
python -m pytest tests/test_charts.py -v 2>&1 | head -10
```

Esperado: `ImportError`.

- [ ] **Step 3: Implementar `src/charts.py`**

```python
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd


def bar_chart(df: pd.DataFrame, x: str, y: str, title: str) -> go.Figure:
    fig = px.bar(df, x=x, y=y, title=title, color=y,
                 color_continuous_scale="Blues")
    fig.update_layout(showlegend=False, coloraxis_showscale=False,
                      plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    return fig


def line_chart(df: pd.DataFrame, x: str, y: str, title: str) -> go.Figure:
    fig = px.line(df, x=x, y=y, title=title, markers=True)
    fig.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    return fig


def choropleth_brazil(df: pd.DataFrame, state_col: str, value_col: str, title: str) -> go.Figure:
    fig = px.choropleth(
        df,
        locations=state_col,
        color=value_col,
        title=title,
        color_continuous_scale="Blues",
        scope="south america",
        locationmode="ISO-3166-2",
        labels={value_col: "Revenue (R$)"},
    )
    fig.update_traces(locationmode="geojson-id")
    # Fallback: si el choropleth no soporta estados de Brasil con locationmode estándar,
    # retornar un bar chart ordenado por estado
    if len(fig.data) == 0 or (hasattr(fig.data[0], 'z') and fig.data[0].z is None):
        return bar_chart(df.sort_values(value_col, ascending=False), state_col, value_col, title)
    fig.update_layout(plot_bgcolor="rgba(0,0,0,0)", paper_bgcolor="rgba(0,0,0,0)")
    return fig
```

- [ ] **Step 4: Correr tests — verificar que pasan**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26/Proyectos/ai-sales-assistant"
python -m pytest tests/test_charts.py -v
```

Esperado: `4 passed`.

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26"
git add Proyectos/ai-sales-assistant/src/charts.py \
        Proyectos/ai-sales-assistant/tests/test_charts.py
git commit -m "feat(ai-sales-assistant): Plotly chart helpers"
```

---

### Task 4: analysis.py — KPIs + dashboard automático

**Files:**
- Create: `Proyectos/ai-sales-assistant/src/analysis.py`
- Create: `Proyectos/ai-sales-assistant/tests/test_analysis.py`

**Interfaces:**
- Consumes: `sample_df` fixture, `bar_chart`, `line_chart`, `choropleth_brazil` de charts.py
- Produces: `run_analysis(df: pd.DataFrame) -> dict` con keys `kpis` y `figs`
  - `result["kpis"]`: `{ total_revenue: float, total_orders: int, aov: float }`
  - `result["figs"]`: `{ monthly: go.Figure, categories: go.Figure, states: go.Figure }`

- [ ] **Step 1: Escribir tests**

`tests/test_analysis.py`:
```python
import pytest
import plotly.graph_objects as go
from src.analysis import run_analysis


def test_run_analysis_returns_dict(sample_df):
    result = run_analysis(sample_df)
    assert isinstance(result, dict)
    assert "kpis" in result
    assert "figs" in result


def test_kpis_total_revenue(sample_df):
    result = run_analysis(sample_df)
    expected = sample_df["payment_value"].sum()
    assert abs(result["kpis"]["total_revenue"] - expected) < 0.01


def test_kpis_total_orders(sample_df):
    result = run_analysis(sample_df)
    expected = sample_df["order_id"].nunique()
    assert result["kpis"]["total_orders"] == expected


def test_kpis_aov(sample_df):
    result = run_analysis(sample_df)
    expected = sample_df["payment_value"].sum() / sample_df["order_id"].nunique()
    assert abs(result["kpis"]["aov"] - expected) < 0.01


def test_figs_are_plotly_figures(sample_df):
    result = run_analysis(sample_df)
    for key in ("monthly", "categories", "states"):
        assert key in result["figs"]
        assert isinstance(result["figs"][key], go.Figure)
```

- [ ] **Step 2: Correr tests — verificar que fallan**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26/Proyectos/ai-sales-assistant"
python -m pytest tests/test_analysis.py -v 2>&1 | head -10
```

Esperado: `ImportError`.

- [ ] **Step 3: Implementar `src/analysis.py`**

```python
import pandas as pd
import plotly.graph_objects as go
from src.charts import bar_chart, line_chart, choropleth_brazil


def run_analysis(df: pd.DataFrame) -> dict:
    total_revenue = round(df["payment_value"].sum(), 2)
    total_orders = df["order_id"].nunique()
    aov = round(total_revenue / total_orders, 2) if total_orders > 0 else 0.0

    monthly = df.copy()
    monthly["month"] = monthly["order_purchase_timestamp"].dt.to_period("M").astype(str)
    monthly_agg = (
        monthly.groupby("month")["payment_value"].sum()
        .reset_index()
        .rename(columns={"payment_value": "revenue"})
        .sort_values("month")
    )
    fig_monthly = line_chart(monthly_agg, x="month", y="revenue", title="Revenue mensual (R$)")

    top_cats = (
        df.groupby("product_category_name_english")["payment_value"].sum()
        .reset_index()
        .rename(columns={"payment_value": "revenue"})
        .sort_values("revenue", ascending=False)
        .head(10)
    )
    fig_categories = bar_chart(top_cats, x="product_category_name_english", y="revenue",
                               title="Top 10 categorías por revenue (R$)")

    by_state = (
        df.groupby("customer_state")["payment_value"].sum()
        .reset_index()
        .rename(columns={"payment_value": "revenue"})
    )
    fig_states = choropleth_brazil(by_state, state_col="customer_state",
                                   value_col="revenue", title="Revenue por estado (R$)")

    return {
        "kpis": {
            "total_revenue": total_revenue,
            "total_orders": total_orders,
            "aov": aov,
        },
        "figs": {
            "monthly": fig_monthly,
            "categories": fig_categories,
            "states": fig_states,
        },
    }
```

- [ ] **Step 4: Correr tests — verificar que pasan**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26/Proyectos/ai-sales-assistant"
python -m pytest tests/test_analysis.py -v
```

Esperado: `5 passed`.

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26"
git add Proyectos/ai-sales-assistant/src/analysis.py \
        Proyectos/ai-sales-assistant/tests/test_analysis.py
git commit -m "feat(ai-sales-assistant): analysis pipeline with KPIs and Plotly charts"
```

---

### Task 5: agent.py — LangChain Pandas DataFrame Agent

**Files:**
- Create: `Proyectos/ai-sales-assistant/src/agent.py`
- Create: `Proyectos/ai-sales-assistant/tests/test_agent.py`

**Interfaces:**
- Consumes: `sample_df` fixture, Groq API key (str)
- Produces:
  - `build_agent(df: pd.DataFrame, api_key: str) -> AgentExecutor`
  - `ask(agent: AgentExecutor, question: str) -> dict` con keys `answer: str`, `intermediate_steps: list`

- [ ] **Step 1: Escribir tests con mock de Groq**

`tests/test_agent.py`:
```python
import pytest
from unittest.mock import MagicMock, patch
from src.agent import build_agent, ask


def test_build_agent_returns_executor(sample_df):
    with patch("src.agent.ChatGroq") as mock_llm_cls, \
         patch("src.agent.create_pandas_dataframe_agent") as mock_create:
        mock_llm = MagicMock()
        mock_llm_cls.return_value = mock_llm
        mock_executor = MagicMock()
        mock_create.return_value = mock_executor

        agent = build_agent(sample_df, api_key="test-key")

        mock_llm_cls.assert_called_once_with(
            model="llama3-70b-8192", api_key="test-key", temperature=0
        )
        mock_create.assert_called_once()
        assert agent is mock_executor


def test_ask_returns_dict_with_answer(sample_df):
    mock_agent = MagicMock()
    mock_agent.invoke.return_value = {
        "output": "El mes con más ventas fue enero con R$ 110.",
        "intermediate_steps": [("action", "observation")],
    }

    result = ask(mock_agent, "¿Cuál fue el mejor mes?")

    assert "answer" in result
    assert "intermediate_steps" in result
    assert result["answer"] == "El mes con más ventas fue enero con R$ 110."
    assert isinstance(result["intermediate_steps"], list)


def test_ask_handles_error_gracefully(sample_df):
    mock_agent = MagicMock()
    mock_agent.invoke.side_effect = Exception("API error")

    result = ask(mock_agent, "pregunta que falla")

    assert "answer" in result
    assert "error" in result["answer"].lower() or "no pude" in result["answer"].lower()
```

- [ ] **Step 2: Correr tests — verificar que fallan**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26/Proyectos/ai-sales-assistant"
python -m pytest tests/test_agent.py -v 2>&1 | head -10
```

Esperado: `ImportError`.

- [ ] **Step 3: Implementar `src/agent.py`**

```python
import pandas as pd
from langchain_groq import ChatGroq
from langchain_experimental.agents import create_pandas_dataframe_agent
from langchain.agents import AgentExecutor

SYSTEM_PREFIX = """Sos un asistente de análisis de ventas para datos de e-commerce de Brasil.
Respondés en español con números concretos y contexto de negocio.
Cuando el resultado sea una tabla o serie de datos, describila en lenguaje natural.
Si la pregunta no está relacionada con los datos de ventas, indicalo amablemente."""


def build_agent(df: pd.DataFrame, api_key: str) -> AgentExecutor:
    llm = ChatGroq(model="llama3-70b-8192", api_key=api_key, temperature=0)
    agent = create_pandas_dataframe_agent(
        llm,
        df,
        verbose=True,
        allow_dangerous_code=True,
        prefix=SYSTEM_PREFIX,
        agent_executor_kwargs={"handle_parsing_errors": True},
    )
    return agent


def ask(agent: AgentExecutor, question: str) -> dict:
    try:
        result = agent.invoke({"input": question})
        return {
            "answer": result.get("output", "Sin respuesta."),
            "intermediate_steps": result.get("intermediate_steps", []),
        }
    except Exception as e:
        return {
            "answer": f"No pude procesar la pregunta. Error: {str(e)}",
            "intermediate_steps": [],
        }
```

- [ ] **Step 4: Correr tests — verificar que pasan**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26/Proyectos/ai-sales-assistant"
python -m pytest tests/test_agent.py -v
```

Esperado: `3 passed`.

- [ ] **Step 5: Commit**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26"
git add Proyectos/ai-sales-assistant/src/agent.py \
        Proyectos/ai-sales-assistant/tests/test_agent.py
git commit -m "feat(ai-sales-assistant): LangChain Pandas agent with Groq llama3-70b"
```

---

### Task 6: app.py — Streamlit UI

**Files:**
- Create: `Proyectos/ai-sales-assistant/app.py`

**Interfaces:**
- Consumes: `load_data()`, `run_analysis()`, `build_agent()`, `ask()`
- Produces: app Streamlit con 2 tabs: Análisis + Preguntas

No hay unit tests para la UI de Streamlit. Verificación: smoke test manual + validación de imports.

- [ ] **Step 1: Implementar `app.py`**

```python
import os
import streamlit as st
from dotenv import load_dotenv
from src.loader import load_data
from src.analysis import run_analysis
from src.agent import build_agent, ask

load_dotenv()

st.set_page_config(
    page_title="AI Sales Assistant",
    page_icon="🤖",
    layout="wide",
)

st.title("🤖 AI Sales Assistant")
st.caption("Olist Brazilian E-Commerce · LangChain + Groq llama3-70b · [Código en GitHub](https://github.com/horaciolaphitz)")


@st.cache_data
def get_data():
    return load_data("data")


@st.cache_resource
def get_agent(_df, api_key):
    return build_agent(_df, api_key)


api_key = os.getenv("GROQ_API_KEY") or st.secrets.get("GROQ_API_KEY", "")

if not api_key:
    st.error("❌ GROQ_API_KEY no encontrada. Configurala en `.env` o en Streamlit Cloud Secrets.")
    st.stop()

with st.spinner("Cargando datos de Olist (~100k órdenes)..."):
    df = get_data()

analysis = run_analysis(df)
kpis = analysis["kpis"]
figs = analysis["figs"]

tab1, tab2 = st.tabs(["📊 Análisis", "💬 Preguntas"])

with tab1:
    col1, col2, col3 = st.columns(3)
    col1.metric("Revenue Total", f"R$ {kpis['total_revenue']:,.0f}")
    col2.metric("Órdenes entregadas", f"{kpis['total_orders']:,}")
    col3.metric("Ticket promedio (AOV)", f"R$ {kpis['aov']:,.2f}")

    st.divider()

    st.plotly_chart(figs["monthly"], use_container_width=True)

    col_a, col_b = st.columns(2)
    with col_a:
        st.plotly_chart(figs["categories"], use_container_width=True)
    with col_b:
        st.plotly_chart(figs["states"], use_container_width=True)

with tab2:
    st.markdown("**Preguntale al assistant sobre los datos de ventas:**")

    example_questions = [
        "¿Cuál fue el mes con más revenue?",
        "¿Cuáles son los 5 estados con más órdenes?",
        "¿Cuál es el ticket promedio por categoría de producto?",
        "¿Qué porcentaje de órdenes tiene más de R$ 200 en precio?",
    ]
    with st.expander("💡 Ejemplos de preguntas"):
        for q in example_questions:
            st.markdown(f"- {q}")

    if "messages" not in st.session_state:
        st.session_state.messages = []

    for msg in st.session_state.messages:
        with st.chat_message(msg["role"]):
            st.markdown(msg["content"])

    if prompt := st.chat_input("Escribí tu pregunta..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        with st.chat_message("assistant"):
            with st.spinner("Analizando..."):
                agent = get_agent(df, api_key)
                result = ask(agent, prompt)

            st.markdown(result["answer"])

            if result["intermediate_steps"]:
                with st.expander("🔍 Ver código Pandas generado"):
                    for action, observation in result["intermediate_steps"]:
                        if hasattr(action, "tool_input"):
                            st.code(action.tool_input, language="python")
                        st.markdown(f"**Resultado:** `{str(observation)[:200]}`")

        st.session_state.messages.append({"role": "assistant", "content": result["answer"]})
```

- [ ] **Step 2: Smoke test — verificar imports**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26/Proyectos/ai-sales-assistant"
python -c "import app; print('Imports OK')" 2>&1 | head -5
```

Esperado: puede fallar por `streamlit.set_page_config` fuera de contexto — eso es normal. Si falla por `ImportError` de módulos propios, hay que corregirlo.

Alternativa más robusta:
```bash
python -c "
from src.loader import load_data
from src.analysis import run_analysis
from src.agent import build_agent, ask
print('All src imports OK')
"
```

Esperado: `All src imports OK`.

- [ ] **Step 3: Correr todos los tests**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26/Proyectos/ai-sales-assistant"
python -m pytest tests/ -v --tb=short
```

Esperado: `13 passed` (5 loader + 4 charts + 5 analysis + 3 agent... ajustar si el conteo difiere pero 0 failures).

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26"
git add Proyectos/ai-sales-assistant/app.py
git commit -m "feat(ai-sales-assistant): Streamlit app with analysis dashboard and LLM chat"
```

---

### Task 7: README + portfolio entry + instrucciones de datos

**Files:**
- Create: `Proyectos/ai-sales-assistant/README.md`
- Create: `src/content/proyectos/ai-sales-assistant.md`

**Interfaces:**
- Consumes: nada nuevo
- Produces: entry visible en el portfolio (featured: true), README con instrucciones completas

- [ ] **Step 1: Crear `README.md`**

```markdown
# AI Sales Assistant

Chat en lenguaje natural sobre 100k+ órdenes de e-commerce de Brasil.
Analizá datos de Olist con LangChain + Groq llama3-70b desde una interfaz Streamlit.

## Setup local

### 1. Descargar datos

Descargá el dataset de Kaggle:
https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce

Copiá estos archivos en `data/`:
- `olist_orders_dataset.csv`
- `olist_order_items_dataset.csv`
- `olist_products_dataset.csv`
- `olist_product_category_name_translation.csv`
- `olist_order_payments_dataset.csv`
- `olist_customers_dataset.csv`

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Configurar API key

Obtené tu Groq API key gratuita en https://console.groq.com/

```bash
cp .env.example .env
# Editá .env y pegá tu GROQ_API_KEY
```

### 4. Correr la app

```bash
streamlit run app.py
```

## Tests

```bash
pytest tests/ -v
```

## Deploy en Streamlit Cloud

1. Fork este repo
2. Ir a https://streamlit.io/cloud → New app → seleccionar este repo
3. Main file: `Proyectos/ai-sales-assistant/app.py`
4. Secrets: `GROQ_API_KEY = "tu_key"`

## Stack

- LangChain + langchain-experimental (Pandas DataFrame Agent)
- Groq llama3-70b-8192
- Streamlit
- Plotly Express
- Pandas
- Dataset: Brazilian E-Commerce Public Dataset (Olist) via Kaggle
```

- [ ] **Step 2: Crear `src/content/proyectos/ai-sales-assistant.md`**

```markdown
---
title: "AI Sales Assistant"
description: "Chat en lenguaje natural sobre 100k+ órdenes de e-commerce. LangChain + Groq llama3-70b analiza datos de Olist Brazil y responde preguntas de negocio en segundos."
pubDate: 2026-06-30
author: "Horacio Laphitz"
category: "GenAI"
tags: ["LangChain", "Groq", "LLM", "Pandas", "Streamlit", "Python", "RAG", "Data Analytics"]
github: "https://github.com/horaciolaphitz/Portfolio-26/tree/main/Proyectos/ai-sales-assistant"
featured: true
draft: false
impact:
  customMetrics:
    dataset_size: "100k+ órdenes"
    llm: "llama3-70b via Groq"
    response_time: "< 3s promedio"
---

Aplicación de análisis conversacional sobre el dataset real de Olist Brazilian E-Commerce.
Combina un dashboard automático de KPIs con un agente LangChain que responde preguntas
en lenguaje natural generando y ejecutando código Pandas en tiempo real.
```

- [ ] **Step 3: Verificar que el portfolio reconoce la entry**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26"
node node_modules/.pnpm/astro@5.17.3_jiti@1.21.7_ro_5c899ca32fcdf2e785ef25a7b9dae2af/node_modules/astro/astro.js build 2>&1 | grep -i "ai-sales\|error\|warn" | head -10
```

Esperado: sin errores fatales. El build debe completar y mencionar el archivo.

- [ ] **Step 4: Commit final**

```bash
cd "C:/Users/Horacio/Desktop/proyectos/Portfolio-26"
git add Proyectos/ai-sales-assistant/README.md \
        src/content/proyectos/ai-sales-assistant.md
git commit -m "feat(ai-sales-assistant): README with setup instructions and portfolio entry"
```

---

## Checklist de criterios de éxito (verificar post-Task 7)

- [ ] `pytest tests/ -v` → 13+ passed, 0 failures
- [ ] `load_data("data")` carga real dataset sin errores (requiere CSVs de Kaggle en `data/`)
- [ ] Dashboard muestra 3 KPI cards + 3 charts al iniciar
- [ ] Q&A responde correctamente a preguntas sobre meses, categorías y estados
- [ ] Código Pandas generado visible en expander
- [ ] Entry `ai-sales-assistant.md` aparece en el portfolio (`featured: true`)
- [ ] Build del portfolio (`astro build`) completa sin errores fatales
