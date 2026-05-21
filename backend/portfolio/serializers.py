from rest_framework import serializers
from .models import Project, Technology, Experience, Education, Certification


class TechnologyNestedSerializer(serializers.Serializer):
    name = serializers.CharField()
    slug = serializers.CharField()
    icon_url = serializers.CharField(allow_null=True, required=False)


class ProjectListSerializer(serializers.ModelSerializer):
    technologies = TechnologyNestedSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'slug', 'title', 'description', 'category',
            'status', 'featured', 'assets', 'created_at', 'updated_at',
            'technologies', 'github_url', 'demo_url',
        ]


class ProjectDetailSerializer(serializers.ModelSerializer):
    technologies = TechnologyNestedSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'slug', 'title', 'description', 'long_description',
            'category', 'status', 'featured', 'highlights', 'assets',
            'created_at', 'updated_at', 'technologies', 'github_url',
            'demo_url', 'pdf_url', 'pdf_size', 'thumbnail_url',
        ]


class TechnologySerializer(serializers.ModelSerializer):
    project_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Technology
        fields = [
            'id', 'name', 'slug', 'icon_url', 'category',
            'created_at', 'project_count',
        ]


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = '__all__'


class ContactMessageSerializer(serializers.Serializer):
    name = serializers.CharField(min_length=2, max_length=100)
    email = serializers.EmailField()
    message = serializers.CharField(min_length=10, max_length=5000)
