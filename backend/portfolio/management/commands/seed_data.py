import json
from datetime import date
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.utils.text import slugify

from portfolio.models import Certification, Education, Experience, Project, Technology

SPANISH_MONTHS = {
    'ene': 1,
    'enero': 1,
    'feb': 2,
    'febrero': 2,
    'mar': 3,
    'marzo': 3,
    'abr': 4,
    'abril': 4,
    'may': 5,
    'mayo': 5,
    'jun': 6,
    'junio': 6,
    'jul': 7,
    'julio': 7,
    'ago': 8,
    'agosto': 8,
    'sep': 9,
    'sept': 9,
    'septiembre': 9,
    'oct': 10,
    'octubre': 10,
    'nov': 11,
    'noviembre': 11,
    'dic': 12,
    'diciembre': 12,
}

ENGLISH_MONTHS = {
    'jan': 1,
    'january': 1,
    'feb': 2,
    'february': 2,
    'mar': 3,
    'march': 3,
    'apr': 4,
    'april': 4,
    'may': 5,
    'jun': 6,
    'june': 6,
    'jul': 7,
    'july': 7,
    'aug': 8,
    'august': 8,
    'sep': 9,
    'sept': 9,
    'september': 9,
    'oct': 10,
    'october': 10,
    'nov': 11,
    'november': 11,
    'dec': 12,
    'december': 12,
}

MONTH_MAP = {**SPANISH_MONTHS, **ENGLISH_MONTHS}


def parse_month_year(term):
    if not term:
        return None

    normalized = term.strip().lower().replace('.', '')
    parts = normalized.split()
    if len(parts) == 1 and parts[0].isdigit():
        return date(int(parts[0]), 1, 1)

    if len(parts) >= 2:
        month = parts[0]
        year = parts[-1]
        month_number = MONTH_MAP.get(month)
        if month_number and year.isdigit():
            return date(int(year), month_number, 1)

    return None


def parse_period_range(period):
    if not period:
        return None, None

    delimiter = '–' if '–' in period else '-' if '-' in period else None
    if delimiter:
        start_token, end_token = [token.strip() for token in period.split(delimiter, 1)]
    else:
        start_token = period.strip()
        end_token = None

    start_date = parse_month_year(start_token)

    if end_token and end_token.lower() not in {'presente', 'present'}:
        end_date = parse_month_year(end_token)
    else:
        end_date = None

    return start_date, end_date


def load_json_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as stream:
            return json.load(stream)
    except FileNotFoundError:
        raise CommandError(f'Missing frontend data file: {path}')
    except json.JSONDecodeError as exc:
        raise CommandError(f'Invalid JSON in {path}: {exc}')


class Command(BaseCommand):
    help = 'Seed the database with portfolio data from frontend generated manifests'

    def handle(self, *args, **options):
        repo_root = Path(__file__).resolve().parents[4]
        frontend_data_dir = repo_root / 'frontend' / 'src' / 'data' / 'generated'

        self.stdout.write(f'Loading frontend data from {frontend_data_dir}...')
        projects_data = load_json_file(frontend_data_dir / 'projects.json')
        profile_data = load_json_file(frontend_data_dir / 'profile.json')
        experience_manifest = load_json_file(frontend_data_dir / 'experience.json')

        self.stdout.write('Seeding technologies...')
        technology_names = set()
        for project in projects_data:
            project_techs = project.get('technologies', []) or []
            for tech in project_techs:
                if isinstance(tech, dict):
                    name = tech.get('name')
                else:
                    name = str(tech)
                if name:
                    technology_names.add(name)

        profile_skills = profile_data.get('skills', []) or []
        for skill in profile_skills:
            if skill:
                technology_names.add(skill)

        if not technology_names:
            self.stdout.write(self.style.WARNING('No technologies found in frontend data.'))

        tech_objects = {}
        for name in sorted(technology_names):
            slug = slugify(name)
            tech, created = Technology.objects.update_or_create(
                slug=slug,
                defaults={
                    'name': name,
                    'category': None,
                },
            )
            tech_objects[name] = tech
            if created:
                self.stdout.write(f'  Created technology: {tech.name}')

        self.stdout.write('Seeding projects...')
        for data in projects_data:
            tech_names = []
            for tech in data.get('technologies', []) or []:
                if isinstance(tech, dict):
                    name = tech.get('name')
                else:
                    name = str(tech)
                if name:
                    tech_names.append(name)

            project_defaults = {
                'title': data.get('title', ''),
                'description': data.get('description', ''),
                'long_description': data.get('description', ''),
                'category': data.get('category', ''),
                'status': data.get('status', 'completed'),
                'featured': bool(data.get('featured', False)),
                'highlights': data.get('highlights', []),
                'assets': data.get('assets', []),
                'github_url': data.get('githubUrl'),
                'demo_url': data.get('demoUrl'),
            }

            project, created = Project.objects.update_or_create(
                slug=data['slug'],
                defaults=project_defaults,
            )
            project_techs = [tech_objects[name] for name in tech_names if name in tech_objects]
            project.technologies.set(project_techs)

            if created:
                self.stdout.write(f'  Created project: {project.title}')
            else:
                self.stdout.write(f'  Updated project: {project.title}')

        self.stdout.write('Seeding experience...')
        for data in experience_manifest.get('experiences', []):
            start_date, end_date = parse_period_range(data.get('period', ''))
            experience_defaults = {
                'description': data.get('description', ''),
                'achievements': data.get('achievements', []),
                'location': data.get('location', ''),
                'type': data.get('type', 'professional'),
                'end_date': end_date,
            }
            experience, created = Experience.objects.update_or_create(
                company=data['company'],
                role=data['role'],
                start_date=start_date,
                defaults=experience_defaults,
            )
            if created:
                self.stdout.write(f'  Created experience: {experience.role} at {experience.company}')
            else:
                self.stdout.write(f'  Updated experience: {experience.role} at {experience.company}')

        self.stdout.write('Seeding education...')
        for data in experience_manifest.get('education', []):
            education_defaults = {
                'location': data.get('location', ''),
                'start_date': None,
                'end_date': None,
                'period': data.get('period', ''),
            }
            education, created = Education.objects.update_or_create(
                institution=data['institution'],
                degree=data['degree'],
                defaults=education_defaults,
            )
            if created:
                self.stdout.write(f'  Created education: {education.degree}')
            else:
                self.stdout.write(f'  Updated education: {education.degree}')

        self.stdout.write('Seeding certifications...')
        for data in experience_manifest.get('certifications', []):
            issue_date = parse_month_year(data.get('period', ''))
            certification_defaults = {
                'issuer': data.get('issuer', ''),
                'issue_date': issue_date,
                'period': data.get('period', ''),
                'certificate_url': data.get('certificateUrl'),
            }
            certification, created = Certification.objects.update_or_create(
                title=data['title'],
                defaults=certification_defaults,
            )
            if created:
                self.stdout.write(f'  Created certification: {certification.title}')
            else:
                self.stdout.write(f'  Updated certification: {certification.title}')

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
