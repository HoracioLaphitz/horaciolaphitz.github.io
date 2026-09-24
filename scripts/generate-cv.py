#!/usr/bin/env python3
"""Generate CV aligned with fuenteDeLaVerdad_Horacio_Laphitz.pdf"""

from fpdf import FPDF
from pathlib import Path

class CV(FPDF):
    def __init__(self):
        super().__init__()
        self.add_font("DejaVu", "", "C:/Windows/Fonts/arial.ttf")
        self.add_font("DejaVu", "B", "C:/Windows/Fonts/arialbd.ttf")
        self.set_auto_page_break(auto=True, margin=20)

    def header(self):
        pass

    def section_title(self, title):
        self.set_font("DejaVu", "B", 11)
        self.set_fill_color(45, 45, 45)
        self.set_text_color(255, 255, 255)
        self.cell(0, 8, title.upper(), ln=True, fill=True)
        self.set_text_color(0, 0, 0)
        self.ln(2)

    def entry(self, period, title, location, details=None):
        self.set_font("DejaVu", "B", 9.5)
        self.cell(35, 5, period, ln=0)
        self.set_font("DejaVu", "B", 9.5)
        self.cell(0, 5, title, ln=True)
        self.set_font("DejaVu", "", 8.5)
        self.set_x(45)
        self.cell(0, 5, location, ln=True)
        if details:
            for detail in details:
                self.set_x(45)
                self.multi_cell(0, 4.5, f"• {detail}")
        self.ln(2)

    def add_skill_category(self, category, skills):
        self.set_font("DejaVu", "B", 9)
        self.cell(35, 5, f"{category}:", ln=0)
        self.set_font("DejaVu", "", 8.5)
        self.multi_cell(0, 4.5, skills)
        self.ln(1)

def generate_cv():
    cv = CV()
    cv.add_page()

    # Header
    cv.set_font("DejaVu", "B", 16)
    cv.cell(0, 8, "HORACIO NAHUEL LAPHITZ", ln=True, align="C")
    cv.set_font("DejaVu", "", 9)
    cv.cell(0, 5, "Soporte Técnico IT | Hardware y Sistemas | Analista de Datos", ln=True, align="C")
    cv.cell(0, 5, "Posadas, Misiones, Argentina", ln=True, align="C")
    cv.cell(0, 5, "horaciolaphitz99@gmail.com | +54 9 3764 862128", ln=True, align="C")
    cv.cell(0, 5, "https://horaciolaphitz.vercel.app/ | linkedin.com/in/horacio-laphitz/", ln=True, align="C")
    cv.ln(4)

    # Perfil Profesional
    cv.section_title("Perfil Profesional")
    cv.set_font("DejaVu", "", 8.5)
    cv.multi_cell(0, 4.5,
        "Soporte técnico IT y hardware con experiencia en diagnóstico y reparación de PC, servidores y estaciones de trabajo. "
        "Configuración de Windows y Linux, mantenimiento preventivo y correctivo, atención a usuarios y documentación técnica. "
        "Complemento con procesamiento y validación de datos usando Python, SQL y Excel, y proyectos de análisis con Power BI. "
        "Busco oportunidades en soporte técnico IT, hardware, operaciones de datos o análisis de datos."
    )
    cv.ln(2)

    # Experiencia
    cv.section_title("Experiencia Profesional")
    cv.entry(
        "Dic 2025 - Mar 2026",
        "Ucrop.it | Data Entry Specialist - Remoto",
        "Procesamiento y validación de datos georreferenciados",
        [
            "Procesamiento y validación de datos georreferenciados con Python y Excel, estandarizando formatos y detectando inconsistencias",
            "Documentación de criterios de validación y procedimientos para facilitar revisión de nuevos lotes",
            "Automatización de tareas de procesamiento y control de datos con Python",
        ]
    )
    cv.entry(
        "Ene 2021 - Nov 2025",
        "PcService Posadas | Técnico de Soporte IT y Hardware",
        "Posadas, Misiones",
        [
            "Diagnóstico y resolución de fallas de hardware y software en PC, servidores y estaciones de trabajo",
            "Mantenimiento preventivo y correctivo, instalación y configuración de Windows y Linux, controladores, programas y periféricos",
            "Evaluación de problemas de arranque, rendimiento, temperatura, memoria, almacenamiento y compatibilidad",
            "Asesoramiento a clientes sobre reparación, actualización y reemplazo de componentes",
            "Soporte a usuarios y documentación de soluciones; automatización de tareas repetitivas",
        ]
    )
    cv.entry(
        "Abr 2024 - May 2024",
        "Ucrop.it | Data Entry - Remoto",
        "Procesamiento de datos georreferenciados",
        [
            "Participación en carga, revisión y validación de datos georreferenciados para agricultura de precisión",
            "Detección de inconsistencias entre información de campo y observaciones históricas",
        ]
    )
    cv.entry(
        "Jul 2019 - Dic 2019",
        "Hospital Escuela Dr. Ramón Madariaga | Capacitador Técnico",
        "Posadas, Misiones",
        [
            "Coordinación de capacitaciones e implementación del sistema R.I.S.mi de imagenología",
            "Relevamiento de necesidades de usuarios y requerimientos técnicos",
            "Resolución de consultas, seguimiento de incidencias y elaboración de reportes de avance",
            "Explicación de procedimientos a usuarios con distintos niveles tecnológicos",
        ]
    )
    cv.entry(
        "Mar 2019 - Jun 2019",
        "Ministerio de Salud Pública de Misiones | Asistente Administrativo Contable",
        "Posadas, Misiones",
        [
            "Gestión de compras de insumos, proveedores y documentación de procesos de licitación",
            "Carga, control y organización de información administrativa con Tango Gestión y ERP internos",
            "Colaboración con equipo contable en elaboración de informes",
        ]
    )

    # Experiencia no remunerada
    cv.section_title("Experiencia No Remunerada")
    cv.entry(
        "Ene 2020 - Dic 2020",
        "Ferretería Centenario | Soporte Informático Ad Honorem",
        "Posadas, Misiones",
        [
            "Implementación de base de datos MySQL para organizar stock, ventas y proveedores",
            "Desarrollo de scripts Python para transformar datos de planillas a la base de datos",
            "Creación de flujos con n8n para registro de ventas y alertas de reposición",
        ]
    )

    # Formación Académica
    cv.section_title("Formación Académica")
    cv.set_font("DejaVu", "B", 9)
    cv.cell(0, 5, "Analista en Sistemas de Comunicación", ln=True)
    cv.set_font("DejaVu", "", 8.5)
    cv.cell(0, 4.5, "Universidad Nacional de Misiones | 2023 - actualidad (En curso)", ln=True)
    cv.ln(1)
    cv.set_font("DejaVu", "B", 9)
    cv.cell(0, 5, "Contador Público Nacional (Ciclo Básico)", ln=True)
    cv.set_font("DejaVu", "", 8.5)
    cv.cell(0, 4.5, "Universidad de la Cuenca del Plata | 2019 - 2020 (Sin finalizar)", ln=True)
    cv.ln(3)

    # Formación Complementaria
    cv.section_title("Formación Complementaria")
    courses = [
        ("SQL con Databricks", "Lovelytics LATAM", "Febrero 2026"),
        ("Python Project for Data Engineering", "IBM / Coursera", "Abril 2024"),
        ("Python for Data Science AI and Development", "IBM / Coursera", "Febrero 2024"),
        ("Certificado Profesional de Análisis de Datos", "Google / Coursera", "Marzo 2024"),
        ("Supervised Machine Learning", "Stanford / Coursera", "Mayo 2024"),
        ("Database Fundamentals", "Silicon Misiones", "2023"),
        ("Introducción a la Programación", "Silicon Misiones", "Diciembre 2022"),
        ("Data Analytics Nivel Growth", "Silicon Misiones", "Marzo 2023"),
        ("Bases de Datos desde Cero", "Silicon Misiones", "Julio 2023"),
    ]
    for title, issuer, date in courses:
        cv.set_font("DejaVu", "B", 8.5)
        cv.cell(35, 4.5, date, ln=0)
        cv.cell(0, 4.5, f"{title} - {issuer}", ln=True)
    cv.ln(2)

    # Habilidades
    cv.section_title("Competencias")
    cv.add_skill_category("Soporte IT", "Diagnóstico de hardware; Mantenimiento preventivo y correctivo; Windows; Linux; Resolución de incidencias")
    cv.add_skill_category("Datos y Automatización", "Python; SQL; Excel; ETL; Limpieza y validación de datos; Power BI")
    cv.add_skill_category("Gestión", "Tango Gestión; ERP; Compras; Proveedores; Organización documental")
    cv.add_skill_category("Interpersonales", "Atención al usuario; Capacitación; Documentación técnica; Trabajo en equipo")
    cv.ln(2)

    # Idiomas y Disponibilidad
    cv.section_title("Idiomas y Disponibilidad")
    cv.set_font("DejaVu", "", 8.5)
    cv.cell(0, 4.5, "Español nativo | Inglés B2", ln=True)
    cv.cell(0, 4.5, "Disponibilidad: Full time | Presencial en Posadas | Remoto desde Argentina", ln=True)
    cv.cell(0, 4.5, "Portfolio: https://horaciolaphitz.vercel.app/", ln=True)

    # Save
    output = Path("public/CV_HoracioNahuelLaphitz.pdf")
    cv.output(str(output))
    print(f"CV generado: {output}")
    print(f"Tamaño: {output.stat().st_size} bytes")

if __name__ == "__main__":
    generate_cv()
