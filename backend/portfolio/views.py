from django.db.models import Count
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response

from .models import Project, Technology, Experience, Education, Certification
from .serializers import (
    ProjectListSerializer,
    ProjectDetailSerializer,
    TechnologySerializer,
    ExperienceSerializer,
    EducationSerializer,
    CertificationSerializer,
    ContactMessageSerializer,
)
from .services.notebook_service import get_all_notebooks, get_notebook_by_slug
from .services.contact_service import handle_contact_message


@api_view(['GET'])
def health_check(request):
    return Response({'status': 'healthy', 'version': '1.0.0'})


@api_view(['GET'])
def root(request):
    return Response({'message': 'Portfolio API v1.0.0'})


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all()
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectListSerializer

    @method_decorator(cache_page(300))
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        category = request.query_params.get('category')
        featured = request.query_params.get('featured')
        status_param = request.query_params.get('status')
        if category:
            queryset = queryset.filter(category__iexact=category)
        if featured is not None:
            queryset = queryset.filter(featured=featured.lower() == 'true')
        if status_param:
            queryset = queryset.filter(status=status_param)
        queryset = self.prefetch_tech(queryset)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @method_decorator(cache_page(300))
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @method_decorator(cache_page(300))
    @action(detail=False)
    def featured(self, request):
        queryset = self.get_queryset().filter(featured=True)
        queryset = self.prefetch_tech(queryset)
        serializer = ProjectListSerializer(queryset, many=True)
        return Response(serializer.data)

    def prefetch_tech(self, queryset):
        return queryset.prefetch_related('technologies')


class TechnologyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Technology.objects.annotate(
        project_count=Count('projects')
    )
    serializer_class = TechnologySerializer
    lookup_field = 'slug'

    @method_decorator(cache_page(300))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(300))
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class ExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer

    @method_decorator(cache_page(300))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class EducationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer

    @method_decorator(cache_page(300))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class CertificationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer

    @method_decorator(cache_page(300))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


@api_view(['GET'])
@cache_page(300)
def notebooks_list(request):
    return Response(get_all_notebooks())


@api_view(['GET'])
def notebooks_detail(request, slug):
    notebook = get_notebook_by_slug(slug)
    if notebook is None:
        return Response(
            {'error': 'Notebook not found', 'detail': {'slug': slug}, 'status': 404},
            status=status.HTTP_404_NOT_FOUND,
        )
    return Response(notebook)


@api_view(['POST'])
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
