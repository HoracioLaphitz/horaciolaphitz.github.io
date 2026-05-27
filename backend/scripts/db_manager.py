#!/usr/bin/env python3
"""
Script to apply migrations and seed the database with CV profile data.
Uses psycopg2-binary directly to apply migrations and seed tables.
"""

import os
import sys
from pathlib import Path
from datetime import date
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Load environment variables
load_dotenv()

POSTGRES_URL = os.getenv("POSTGRES_URL")
if not POSTGRES_URL:
    print("[ERROR] POSTGRES_URL environment variable must be set")
    sys.exit(1)


def get_connection():
    """Establish connection to PostgreSQL database"""
    return psycopg2.connect(POSTGRES_URL)


def apply_migrations():
    """Apply migrations in order, checking if they are already applied"""
    migrations_dir = Path(__file__).parent.parent.parent / "supabase" / "migrations"
    migration_files = sorted(migrations_dir.glob("*.sql"))
    
    print("[MIGRATION] Checking database migrations...")
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            for file_path in migration_files:
                # Check if projects table exists to skip initial setup migrations
                if file_path.name in ["001_initial_schema.sql", "002_seed_data.sql", "003_add_project_resources.sql"]:
                    cur.execute("SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'projects');")
                    if cur.fetchone()[0]:
                        print(f"[MIGRATION] Skipping already applied: {file_path.name}")
                        continue
                
                # Check if education table exists to skip schema fixes/additions migration
                if file_path.name == "004_fix_and_expand_schema.sql":
                    cur.execute("SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'education');")
                    if cur.fetchone()[0]:
                        print(f"[MIGRATION] Skipping already applied: {file_path.name}")
                        continue

                print(f"[MIGRATION] Applying: {file_path.name}")
                with open(file_path, "r", encoding="utf-8") as f:
                    sql = f.read()
                    cur.execute(sql)
        conn.commit()
        print("[MIGRATION] Migrations completed successfully!\n")
    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Error applying migrations: {e}")
        sys.exit(1)
    finally:
        conn.close()


def seed_cv_data():
    """Seed experience, education, and certifications data"""
    print("[SEED] Seeding CV profile data...")
    
     
    experience_data = [
        (
            "Ucrop.it",
            "Data Entry Specialist",
            date(2025, 12, 1),
            date(2026, 3, 31),
            "Procesamiento y validación de datos georreferenciados con Python, SQL y Excel. Detección de inconsistencias con exploración geoespacial y colaboración con equipos multidisciplinarios.",
            "[]",  # empty achievements JSON
            "Remoto",
            "professional"
        ),
        (
            "PcService Posadas",
            "Técnico en Sistemas",
            date(2020, 1, 1),
            date(2024, 3, 30),
            "Mantenimiento de hardware en PCs y servidores, reparación de equipos, configuración y optimización de sistemas en red, y diagnóstico de fallas técnicas.",
            "[]",
            "Posadas",
            "professional"
        ),
        (
            "Ucrop.it",
            "Data Entry",
            date(2024, 3, 1),
            date(2024, 5, 31),
            "Entrada precisa y eficiente de datos georreferenciados, validación de datos geoespaciales y exploración geoespacial.",
            "[]",
            "Remoto",
            "professional"
        ),
        (
            "Hospital Escuela Dr. Ramón Madariaga",
            "Capacitador Técnico en Sistemas",
            date(2019, 7, 1),
            date(2019, 12, 31),
            "Coordinación de equipo de capacitación, implementación de sistema R.I.S.mi, relevamiento de requerimientos técnicos, seguimiento de desempeño del personal y elaboración de reportes.",
            "[]",
            "Posadas",
            "professional"
        ),
        (
            "Ministerio de Salud Pública de Misiones",
            "Asistente Administrativo Contable",
            date(2019, 3, 1),
            date(2019, 6, 30),
            "Gestión de compras de insumos, administración de proveedores, gestión de licitaciones y uso de sistemas Tango Gestión y ERP interno.",
            "[]",
            "Posadas",
            "professional"
        ),
        (
            "Ferretería Centenario Posadas",
            "Colaborador",
            date(2020, 1, 1),
            date(2020, 12, 31),
            "Desarrollo de base de datos en MySQL, automatización de procesos con n8n y desarrollo de pipelines de datos con Python.",
            "[]",
            "Posadas",
            "non-remunerated"
        )
    ]
    
    # 2. Education Data
    education_data = [
        (
            "Universidad Nacional de Misiones",
            "Analista en Sistemas de Comunicación",
            "Posadas, Misiones",
            date(2023, 3, 1),
            None,
            "2023 - En curso"
        ),
        (
            "Universidad de la Cuenca del Plata (Posadas)",
            "Contador Público Nacional (1 año completo)",
            "Posadas, Misiones",
            date(2019, 3, 1),
            date(2020, 12, 1),
            "2019 - 2020"
        ),
        (
            "Instituto Superior Antonio Ruiz de Montoya",
            "Técnico Superior en Análisis de Sistemas",
            "Posadas, Misiones",
            date(2018, 3, 1),
            date(2020, 12, 1),
            "2018 - 2020"
        )
    ]
    
    # 3. Certifications Data
    certifications_data = [
        ("SQL con Databricks", "Lovelytics Latam", date(2026, 2, 1), "Febrero 2026", None, None),
        ("Business & Operations Management Excellence", "MTF Institute - Udemy", date(2025, 3, 1), "Mar 2025", "/Certificaciones/Certificate in Business & Operations Management Excellence.pdf", None),
        ("Sales & Service Data Analysis & Analytics Expert", "MTF Institute - Udemy", date(2025, 3, 1), "Mar 2025", "/Certificaciones/Sales & Service Data Analysis & Analytics Expert.pdf", None),
        ("Microsoft Office Mastery", "Sayman Creative Institute - Udemy", date(2025, 3, 1), "Mar 2025", "/Certificaciones/Microsoft Office Mastery Learn Word Excel and PowerPoint.pdf", None),
        ("Professional Diploma in Corporate Management", "MTF Institute - Udemy", date(2025, 3, 1), "Mar 2025", "/Certificaciones/Prefesional diploma in corporate managemet.pdf", None),
        ("Supervised Machine Learning", "Stanford University - Coursera", date(2024, 5, 1), "May 2024", "/Certificaciones/Supervised Machine Learning_ Regression and Classification.pdf", None),
        ("Python for Data Engineering", "IBM - Coursera", date(2024, 4, 1), "Abr 2024", "/Certificaciones/IBM-python-data-engineering.pdf", "78a917fc-2fee-416b-a3c4-d14f3cd09541"),
        ("Certificado Profesional de Análisis de Datos", "Google Careers - Coursera", date(2024, 3, 1), "Mar 2024", "/Certificaciones/GOOGLE-PYTHON-CERTIFICATE.pdf", None),
        ("Fundamentos de Ciencia de Datos", "Google Careers - Coursera", date(2024, 3, 1), "Mar 2024", "/Certificaciones/Fundamentos de ciencia de datos.pdf", None),
        ("Python for Data Science, AI & Development", "IBM - Coursera", date(2024, 2, 1), "Feb 2024", "/Certificaciones/IBM-DATA SCIENCE - AI - DEVELOPMENT.pdf", "57d36636-8b10-4218-a641-7cd6fcf9d8fe"),
        ("Analisis computacional de Datos en R", "Google Careers - Coursera", date(2024, 2, 1), "Feb 2024", "/Certificaciones/GOOGLE-Analisis-computacional-de-datos-R.pdf", None),
        ("Curso Final de Analisis Computacional de Datos", "Google Careers - Coursera", date(2024, 2, 1), "Feb 2024", "/Certificaciones/Curso final de analisis computacional de datos completa un caso practico.pdf", None),
        ("Go Beyond the Numbers: Translate Data into Insights", "Google Careers - Coursera", date(2024, 1, 1), "Ene 2024", "/Certificaciones/GoBeyondtheNumbersTranslateData.pdf", None),
        ("Get Started with Python", "Google Careers - Coursera", date(2024, 1, 1), "Ene 2024", "/Certificaciones/GOOGLE-PYTHON-CERTIFICATE.pdf", None),
        ("Tu Primera Experiencia como Analista de Datos", "Google Careers - Coursera", date(2024, 1, 1), "Ene 2024", "/Certificaciones/certificate-of-completion-for-tu-primera-experiencia-como-analista-de-datos.pdf", None),
        ("Python Expertise", "Nicolas Schurmann - Udemy", date(2023, 12, 1), "Dic 2023", "/Certificaciones/Python-Developer-Udemy.pdf", None),
        ("Introduccion a Machine Learning", "Domestika", date(2023, 11, 1), "Nov 2023", None, None),
        ("Bases de Datos desde Cero", "Silicon Misiones", date(2023, 7, 1), "Jul 2023", "/Certificaciones/SILICON MISIONES- Certificado Digital Bases de Datos.pdf", None),
        ("Data Analytics Nivel Growth", "Silicon Misiones", date(2023, 3, 1), "Mar 2023", "/Certificaciones/SILICON MISIONES-Certificado de Data & Analytics.pdf", None),
        ("Introduccion a la Programacion", "Silicon Misiones", date(2022, 12, 1), "Dic 2022", "/Certificaciones/SILICON MISIONES- Certificado Laphitz Horacio Intro a la programacion.pdf", None)
    ]
    
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            # Clear existing seed data to avoid duplicates
            cur.execute("DELETE FROM experience;")
            cur.execute("DELETE FROM education;")
            cur.execute("DELETE FROM certifications;")
            
            # Insert Experience
            execute_values(
                cur,
                """
                INSERT INTO experience (company, role, start_date, end_date, description, achievements, location, type)
                VALUES %s
                """,
                experience_data
            )
            print(f"[SEED] Seeded {len(experience_data)} experience rows.")
            
            # Insert Education
            execute_values(
                cur,
                """
                INSERT INTO education (institution, degree, location, start_date, end_date, period)
                VALUES %s
                """,
                education_data
            )
            print(f"[SEED] Seeded {len(education_data)} education rows.")
            
            # Insert Certifications
            execute_values(
                cur,
                """
                INSERT INTO certifications (title, issuer, issue_date, period, certificate_url, credly_badge_id)
                VALUES %s
                """,
                certifications_data
            )
            print(f"[SEED] Seeded {len(certifications_data)} certifications rows.")
            
        conn.commit()
        print("[SEED] Data seeding completed successfully!\n")
    except Exception as e:
        conn.rollback()
        print(f"[ERROR] Error seeding data: {e}")
        sys.exit(1)
    finally:
        conn.close()


if __name__ == "__main__":
    apply_migrations()
    seed_cv_data()
