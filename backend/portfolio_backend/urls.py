from django.contrib import admin
from django.urls import path, include
from portfolio import views as portfolio_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health', portfolio_views.health_check, name='health-check'),
    path('api/', include('portfolio.urls')),
]
