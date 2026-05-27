from django.db.models import Count
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_headers
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action, api_view, throttle_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .models import Certification, Education, Experience, Project, Technology
from .serializers import (
    CertificationSerializer,
    ContactMessageSerializer,
    EducationSerializer,
    ExperienceSerializer,
    ProjectDetailSerializer,
    ProjectListSerializer,
    TechnologySerializer,
)
from .services.contact_service import handle_contact_message
from .services.notebook_service import get_all_notebooks, get_notebook_by_slug

# Module-level constants for static responses (avoids allocation per request)
_HEALTH_RESPONSE = {'status': 'healthy', 'version': '1.0.0'}
_ROOT_RESPONSE = {'application': 'Portfolio API', 'version': '1.0.0'}
_PROFILE_RESPONSE = {
    'name': 'Horacio Nahuel Laphitz',
    'role': 'Analista de Datos',
    'email': 'horaciolaphitz99@gmail.com',
    'location': 'Posadas, Misiones',
    'availability': 'Full-Time',
    'summary': (
        'Orientación a posiciones de Analista de Datos Jr., Analista Funcional y áreas '
        'administrativas. Formación en análisis de datos, programación y gestión de '
        'información.'
    ),
    'skills': [
        'Python',
        'SQL',
        'Power BI',
        'Looker Studio',
        'Tableau',
        'Excel Avanzado',
        'Bash',
        'R',
        'Machine Learning',
        'PostgreSQL',
        'MySQL',
        'MongoDB',
        'Databricks',
        'Windows',
        'Linux',
        'Word',
        'PowerPoint',
    ],
    'social': {
        'github': 'https://github.com/horaciolaphitz',
        'linkedin': 'https://www.linkedin.com/in/horacio-laphitz/',
        'credly': 'https://www.credly.com/users/horacio-laphitz',
    },
}


@api_view(['GET'])
def health_check(request):
    return Response(_HEALTH_RESPONSE)


@api_view(['GET'])
@cache_page(60 * 60)  # 1 hour — completely static view data
@vary_on_headers()
def root(request):
    return Response(_ROOT_RESPONSE)


@api_view(['GET'])
@cache_page(60 * 60)  # 1 hour — profile data changes only with code deploys
@vary_on_headers()
def profile(request):
    return Response(_PROFILE_RESPONSE)


class DefaultPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100


# Cache TTLs
_PROJECTS_CACHE_TTL = 60 * 5       # 5 minutes
_SMALL_CACHE_TTL = 60 * 15         # 15 minutes for rarely-changing data


@method_decorator(cache_page(_PROJECTS_CACHE_TTL), name='dispatch')
class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all()
    lookup_field = 'slug'
    pagination_class = DefaultPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'technologies__name']
    ordering_fields = ['created_at', 'title']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')
        status_param = self.request.query_params.get('status')
        if category:
            qs = qs.filter(category__iexact=category)
        if featured is not None:
            qs = qs.filter(featured=featured.lower() == 'true')
        if status_param:
            qs = qs.filter(status=status_param)
        # Only load fields needed for list/detail views, skip heavy JSON/text
        if self.action in ('list', 'featured'):
            qs = qs.only(
                'slug', 'title', 'description', 'category', 'status',
                'featured', 'assets', 'created_at', 'updated_at',
                'github_url', 'demo_url',
            )
        else:
            qs = qs.only(
                'slug', 'title', 'description', 'long_description',
                'category', 'status', 'featured', 'highlights', 'assets',
                'created_at', 'updated_at', 'github_url', 'demo_url',
                'pdf_url', 'pdf_size', 'thumbnail_url',
            )
        return qs.prefetch_related('technologies')

    @action(detail=False, url_path='featured')
    def featured(self, request):
        qs = self.get_queryset().filter(featured=True)
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = ProjectListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = ProjectListSerializer(qs, many=True)
        return Response(serializer.data)


@method_decorator(cache_page(_SMALL_CACHE_TTL), name='dispatch')
class TechnologyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Technology.objects.annotate(project_count=Count('projects'))
    serializer_class = TechnologySerializer
    lookup_field = 'slug'
    pagination_class = None


@method_decorator(cache_page(_SMALL_CACHE_TTL), name='dispatch')
class ExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    pagination_class = None


@method_decorator(cache_page(_SMALL_CACHE_TTL), name='dispatch')
class EducationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    pagination_class = None


@method_decorator(cache_page(_SMALL_CACHE_TTL), name='dispatch')
class CertificationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer
    pagination_class = None


@api_view(['GET'])
@cache_page(60 * 5)  # 5 minutes — notebooks data from filesystem
@vary_on_headers()
def notebooks_list(request):
    return Response(get_all_notebooks())


@api_view(['GET'])
@cache_page(60 * 5)
@vary_on_headers()
def notebooks_detail(request, slug):
    notebook = get_notebook_by_slug(slug)
    if notebook is None:
        return Response(
            {'error': 'Notebook not found', 'detail': {'slug': slug}, 'status': 404},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response(notebook)


class ContactRateThrottle(AnonRateThrottle):
    rate = '5/hour'


@api_view(['POST'])
@throttle_classes([ContactRateThrottle])
def contact_submit(request):
    serializer = ContactMessageSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
    result = handle_contact_message(
        name=serializer.validated_data['name'],
        email=serializer.validated_data['email'],
        message=serializer.validated_data['message'],
    )
    http_code = status.HTTP_200_OK if result['success'] else status.HTTP_500_INTERNAL_SERVER_ERROR
    return Response(result, status=http_code)
