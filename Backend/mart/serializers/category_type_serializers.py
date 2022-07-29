from rest_framework import serializers
from mart.models import Category, CategoryType


class _CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class CategoryTypeSerializer(serializers.ModelSerializer):
    categories = _CategorySerializer(many=True)

    class Meta:
        model = CategoryType
        fields = ['id', 'name', 'icon', 'categories']
