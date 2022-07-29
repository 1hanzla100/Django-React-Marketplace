from rest_framework import serializers, exceptions
from mart.models import Listing, ListingImage, Category
from users.serializers import UserSerializer
from django.core.files.base import ContentFile


class _CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class ListingImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField('get_image_url')

    class Meta:
        model = ListingImage
        fields = ['id', 'image', 'image_url']
        read_only_fields = ['id']

    def get_image_url(self, obj):
        request = self.context.get("request")
        return request.build_absolute_uri(obj.image.url)


class ListingSerializer(serializers.ModelSerializer):
    category = _CategorySerializer()
    user = UserSerializer(read_only=True)
    images = ListingImageSerializer(many=True, read_only=True)

    class Meta:
        model = Listing
        fields = [
            'id', 'slug', 'title', 'description', 'price', 'category', 'condition',
            'get_condition_display', 'offer_delivery', 'public_meetup',
            'door_pickup', 'drop_off', 'location_longitude', 'location_latitude',
            'user', 'images', 'timestamp'
        ]
        read_only_fields = ['id', 'slug', 'user']


class CreateListingImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()

    class Meta:
        model = ListingImage
        fields = ['image']


class CreateListingSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    user = UserSerializer(read_only=True)
    images = CreateListingImageSerializer(many=True, required=True)

    class Meta:
        model = Listing
        fields = [
            'id', 'slug', 'title', 'description', 'price', 'category',
            'condition', 'offer_delivery', 'public_meetup', 'door_pickup',
            'drop_off', 'location_longitude', 'location_latitude', 'user', 'images'
        ]
        read_only_fields = ['id', 'slug', 'user']

    def create(self, validated_data, user):
        # ! While Creating request in postman form data use --> images[0]image --> and select the file
        images_data = validated_data.get('images')
        listing_data = validated_data.copy()
        listing_data.pop('images')
        listing = Listing.objects.create(user=user, **listing_data)
        for image in images_data:
            image_data = ContentFile(image.get('image').read())
            image_data.name = image.get('image').name
            ListingImage.objects.create(listing=listing, image=image_data)
        return listing


class UpdateListingSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    user = UserSerializer(read_only=True)
    images = CreateListingImageSerializer(many=True, required=False)

    class Meta:
        model = Listing
        fields = [
            'id', 'slug', 'title', 'description', 'price', 'category',
            'condition', 'offer_delivery', 'public_meetup', 'door_pickup',
            'drop_off', 'location_longitude', 'location_latitude', 'user', 'images'
        ]
        read_only_fields = ['id', 'slug', 'user']

    def update(self, user, instance, validated_data):
        if instance.user == user:
            if 'images' in validated_data:
                images_data = validated_data.get('images')
                listing_data = validated_data.copy()
                listing_data.pop('images')
                instance.__dict__.update(**listing_data)
                instance.save()
                for image in images_data:
                    image_data = ContentFile(image.get('image').read())
                    image_data.name = image.get('image').name
                    ListingImage.objects.create(listing=instance, image=image_data)
                return instance
            else:
                instance.__dict__.update(**validated_data)
                instance.save()
                return instance
        else:
            raise exceptions.PermissionDenied()
