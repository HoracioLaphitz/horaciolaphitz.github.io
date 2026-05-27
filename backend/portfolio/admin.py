from django.contrib import admin

from .models import Certification, ContactMessage, Education, Experience, Project, Technology


class ProjectTechnologyInline(admin.TabularInline):
    model = Project.technologies.through
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug', 'category', 'status', 'featured', 'created_at']
    list_filter = ['category', 'status', 'featured']
    search_fields = ['title', 'description']
    prepopulated_fields = {'slug': ['title']}
    inlines = [ProjectTechnologyInline]


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'category']
    search_fields = ['name']
    prepopulated_fields = {'slug': ['name']}


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['role', 'company', 'start_date', 'end_date', 'type']
    list_filter = ['type']


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ['degree', 'institution', 'start_date', 'end_date']


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ['title', 'issuer', 'issue_date']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'created_at', 'read']
    list_filter = ['read', 'created_at']
    search_fields = ['name', 'email', 'message']
    date_hierarchy = 'created_at'
    readonly_fields = ['name', 'email', 'message', 'created_at']
