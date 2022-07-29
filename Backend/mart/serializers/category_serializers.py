from rest_framework import serializers
from mart.models import Category, CategoryType
from mart.serializers.listing_serializers import ListingSerializer


class _CategoryTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryType
        fields = ['id', 'name', 'icon']


class CategorySerializer(serializers.ModelSerializer):
    type = _CategoryTypeSerializer(read_only=True)
    listings = ListingSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'type', 'listings']
