from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from portfolio import views as portfolio_views

urlpatterns = [
    path('', lambda request: redirect('api/', permanent=False)),
    path('admin/', admin.site.urls),
    path('api/health', portfolio_views.health_check, name='health-check'),
    path('api/', include('portfolio.urls')),
]
