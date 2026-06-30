# AI Sales Assistant — Design Spec

**Date:** 2026-06-30
**Status:** Approved
**Goal:** Streamlit app que analiza el dataset Olist (Brazilian E-Commerce) con LangChain + Groq, mostrando dashboard automático y chat en lenguaje natural sobre datos de ventas.

---

## Contexto

Proyecto portfolio para demostrar Applied GenAI Data Analytics: RAG-style Q&A sobre datos estructurados + análisis automático. Apunta a recruiters que buscan LangChain, LLMs aplicados a datos de negocio, y Python avanzado.

---

## Stack

| Componente | Tecnología |
|---|---|
| UI | Streamlit |
| LLM | Groq — llama3-70b-8192 (free tier) |
| Orquestación | LangChain + langchain_experimental |
| Datos | Pandas |
| Visualización | Plotly Express |
| Dataset | Olist Brazilian E-Commerce (Kaggle) |
| Deploy | Streamlit Cloud (gratis) |
| Python | 3.11+ |

---

## Dataset

**Brazilian E-Commerce Public Dataset by Olist**
URL: https://www.kaggle.com/datasets/olistbr/brazilian-ecommerce

Tablas usadas:
- `olist_orders_dataset.csv` — órdenes con fechas y status
- `olist_order_items_dataset.csv` — items, precios, freight
- `olist_products_dataset.csv` — categorías
- `olist_order_payments_dataset.csv` — métodos y montos de pago
- `olist_customers_dataset.csv` — geolocalización clientes

DataFrame principal (`df`) = merge de las 5 tablas por `order_id` / `product_id` / `customer_id`. ~100k filas post-merge. Columnas clave: `order_purchase_timestamp`, `price`, `freight_value`, `payment_value`, `product_category_name_english`, `customer_state`, `order_status`.

---

## Estructura de archivos

```
Proyectos/ai-sales-assistant/
├── data/
│   ├── olist_orders_dataset.csv
│   ├── olist_order_items_dataset.csv
│   ├── olist_products_dataset.csv
│   ├── olist_order_payments_dataset.csv
│   └── olist_customers_dataset.csv
├── src/
│   ├── loader.py       ← carga y merge de tablas, @st.cache_data
│   ├── analysis.py     ← KPIs + figuras Plotly (corre al iniciar)
│   ├── agent.py        ← LangChain Pandas DataFrame Agent + Groq
│   └── charts.py       ← helpers Plotly reutilizables
├── app.py              ← Streamlit entry point
├── requirements.txt
├── .env.example
└── README.md

src/content/proyectos/
└── ai-sales-assistant.md   ← portfolio entry (MDX frontmatter)
```

---

## Componentes

### loader.py

```python
# Interfaz pública
def load_data(data_dir: str = "data") -> pd.DataFrame:
    """Carga y mergea las 5 tablas Olist. Cachea con @st.cache_data."""
```

Responsabilidades:
- Lee los 5 CSVs
- Merge: orders ← items ← products ← payments ← customers
- Parsea fechas (`order_purchase_timestamp` → datetime)
- Filtra status `delivered` únicamente (datos limpios para análisis)
- Devuelve un DataFrame con columnas estandarizadas

### analysis.py

```python
# Interfaz pública
def run_analysis(df: pd.DataFrame) -> dict:
    """Retorna dict con KPIs (valores) y figuras (Plotly fig objects)."""
```

KPIs calculados:
- `total_revenue`: suma de `payment_value`
- `total_orders`: conteo de `order_id` únicos
- `aov`: Average Order Value = total_revenue / total_orders
- `top_categories`: top 10 por revenue
- `monthly_revenue`: serie temporal por mes
- `revenue_by_state`: mapa de calor por estado brasileño

Retorna: `{ "kpis": {...}, "figs": {"monthly": fig, "categories": fig, "states": fig} }`

### agent.py

```python
# Interfaz pública
def build_agent(df: pd.DataFrame, api_key: str) -> AgentExecutor:
    """Crea LangChain Pandas DataFrame Agent con Groq llama3-70b."""

def ask(agent: AgentExecutor, question: str) -> dict:
    """Ejecuta pregunta. Retorna { answer: str, intermediate_steps: list }."""
```

- `llm = ChatGroq(model="llama3-70b-8192", api_key=api_key)`
- `agent = create_pandas_dataframe_agent(llm, df, verbose=True, allow_dangerous_code=True)`
- Prefijo de sistema: instruye al agente a responder en español, incluir números concretos, y sugerir visualizaciones cuando aplique

### charts.py

```python
# Helpers — retornan fig, no renderizan
def bar_chart(df, x, y, title) -> go.Figure
def line_chart(df, x, y, title) -> go.Figure
def choropleth_brazil(df, state_col, value_col, title) -> go.Figure
```

### app.py

Estructura Streamlit:
```
st.title("🤖 AI Sales Assistant")
st.caption("Olist Brazilian E-Commerce · LangChain + Groq llama3-70b")

df = load_data()

tab1, tab2 = st.tabs(["📊 Análisis", "💬 Preguntas"])

with tab1:
    # KPI cards en 3 columnas
    col1, col2, col3 = st.columns(3)
    # Charts: monthly revenue, top categories, states heatmap
    # st.plotly_chart para cada fig

with tab2:
    # st.chat_input + st.chat_message
    # Muestra respuesta LLM + código generado (st.expander)
    # Si resultado es numérico → genera chart automático
    # Historial con st.session_state.messages
```

---

## Flujo Q&A

```
1. Usuario escribe en st.chat_input
2. app.py llama ask(agent, question)
3. agent.py → LLM genera código Pandas → ejecuta con python_repl_ast
4. Resultado + pasos intermedios retornan a app.py
5. app.py renderiza:
   - Respuesta en lenguaje natural (st.chat_message "assistant")
   - Código generado en st.expander("Ver código")
   - Si resultado es DataFrame/número → charts.py genera viz
```

---

## Configuración

`.env.example`:
```
GROQ_API_KEY=your_groq_api_key_here
```

En Streamlit Cloud: `GROQ_API_KEY` como secret (Settings → Secrets).
En local: `python-dotenv` carga `.env`.

---

## Integración con portfolio

`src/content/proyectos/ai-sales-assistant.md`:
```yaml
---
title: "AI Sales Assistant"
description: "Chat en lenguaje natural sobre 100k+ órdenes de e-commerce. LangChain + Groq llama3-70b analiza datos de Olist Brazil y responde preguntas de negocio en segundos."
pubDate: 2026-06-30
category: "GenAI"
tags: ["LangChain", "Groq", "LLM", "Pandas", "Streamlit", "Python", "RAG"]
github: "https://github.com/horaciolaphitz/Portfolio-26/tree/main/Proyectos/ai-sales-assistant"
dashboard: "https://ai-sales-assistant-hl.streamlit.app"
featured: true
---
```

Screenshot del app en `public/img/proyectos/ai-sales-assistant.png` (tomar post-deploy).

---

## Criterios de éxito

1. `load_data()` carga y mergea sin errores en < 5s (con cache)
2. Dashboard muestra 3 KPI cards + 3 charts al iniciar
3. Q&A responde correctamente a: "¿Cuál fue el mes con más ventas?", "Top 5 categorías por revenue", "¿Cuál es el estado con más órdenes?"
4. Código Pandas generado es visible en expander
5. App deployada en Streamlit Cloud, accesible sin API key propia
6. Entry `ai-sales-assistant.md` aparece en el portfolio (featured: true)
7. README con instrucciones de instalación local + link al deploy
