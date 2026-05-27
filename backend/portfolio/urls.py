from django.urls import path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter(trailing_slash=False)
router.register(r'v1/projects', views.ProjectViewSet, basename='project')
router.register(r'v1/technologies', views.TechnologyViewSet, basename='technology')
router.register(r'v1/experience', views.ExperienceViewSet, basename='experience')
router.register(r'v1/education', views.EducationViewSet, basename='education')
router.register(r'v1/certifications', views.CertificationViewSet, basename='certification')

urlpatterns = [
    path('v1/profile', views.profile, name='profile'),
    path('v1/notebooks', views.notebooks_list, name='notebooks-list'),
    path('v1/notebooks/<slug:slug>', views.notebooks_detail, name='notebooks-detail'),
    path('v1/contact', views.contact_submit, name='contact-submit'),
    path('', views.root, name='root'),
] + router.urls
