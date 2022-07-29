from rest_framework.filters import SearchFilter, OrderingFilter
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework import generics, exceptions
from .models import *
from .serializers.category_type_serializers import CategoryTypeSerializer
from .serializers.listing_serializers import ListingSerializer, CreateListingSerializer, UpdateListingSerializer
from django.contrib.auth import get_user_model

User = get_user_model()


@csrf_exempt
@api_view(['GET'])
def listing_conditions_options(request):
    listing_conditions = [{
        "value": choice[0],
        "label": choice[1]
    } for choice in Listing.ConditionChoices.choices]
    return Response(listing_conditions)


@ csrf_exempt
@ api_view(['GET'])
def category_types(request):
    category_types = CategoryType.objects.all()
    serializer = CategoryTypeSerializer(category_types, many=True)
    return Response(serializer.data)


# @ csrf_exempt
# @ api_view(['GET'])
# def listings_by_category(request, category_slug):
#     listings = Listing.objects.filter(category__slug=category_slug)
#     serializer = ListingSerializer(listings, context={"request": request}, many=True)
#     return Response(serializer.data)

@ csrf_exempt
@ api_view(['GET'])
def get_category_detail(request, category_slug):
    category = get_object_or_404(Category, slug=category_slug)
    return Response({"id": category.id, "name": category.name})


class ListingByCategoryList(generics.ListAPIView):
    serializer_class = ListingSerializer
    queryset = Listing.objects.all()
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'category__name']
    ordering_fields = ['title', 'timestamp']
    lookup_url_kwarg = 'category_slug'

    def get_queryset(self):
        slug = self.kwargs.get(self.lookup_url_kwarg)
        return Listing.objects.filter(category__slug=slug)

    def get_serializer_context(self):
        return {'request': self.request}


class ListingList(generics.ListAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'category__name']
    ordering_fields = ['title', 'timestamp']


class ListingDetailView(generics.RetrieveAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    lookup_field = 'slug'


class ListingDeleteVew(generics.DestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user = User.objects.get(email=request.user.email)
        if instance.user == user:
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            raise exceptions.PermissionDenied()


@ csrf_exempt
@ api_view(['GET'])
@ permission_classes((IsAuthenticated,))
def my_listings(request):
    user = request.user
    listings = Listing.objects.filter(user=user)
    serializer = ListingSerializer(listings, context={"request": request}, many=True)
    return Response(serializer.data)


@ csrf_exempt
@ api_view(['POST'])
@ permission_classes((IsAuthenticated,))
def create_listing(request):
    user = request.user
    serializer = CreateListingSerializer(data=request.data)
    if serializer.is_valid():
        listing = serializer.create(user=user, validated_data=serializer.validated_data)
        return Response(ListingSerializer(listing, context={"request": request}).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@ csrf_exempt
@ api_view(['PUT'])
@ permission_classes((IsAuthenticated,))
def update_listing(request, slug):
    user = request.user
    listing = get_object_or_404(Listing, slug=slug)
    serializer = UpdateListingSerializer(data=request.data)
    if serializer.is_valid():
        listing = serializer.update(user=user, instance=listing, validated_data=serializer.validated_data)
        return Response(ListingSerializer(listing, context={"request": request}).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['DELETE'])
@permission_classes((IsAuthenticated,))
def delete_listing_image(request, slug, image_id):
    user = request.user
    listing = get_object_or_404(Listing, slug=slug)
    if listing.user == user:
        listing.images.get(id=image_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        raise exceptions.PermissionDenied()
