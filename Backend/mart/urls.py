from django.urls import path
from .views import listing_conditions_options, category_types, ListingByCategoryList, my_listings, create_listing, ListingList, ListingDetailView, ListingDeleteVew, get_category_detail, update_listing, delete_listing_image

urlpatterns = [
    path('listing-conditions-options/', listing_conditions_options, name='listing_conditions_options'),
    path('category-types/', category_types, name='category_types'),
    path('listings-by-category/<str:category_slug>/', ListingByCategoryList.as_view(), name='listings_by_category'),
    path('listings/', ListingList.as_view(), name='listings'),
    path('listings/<str:slug>/', ListingDetailView.as_view(), name='listing_detail'),
    path('my-listings/', my_listings, name='my_listings'),
    path('create-listing/', create_listing, name='create_listing'),
    path('listings/<str:slug>/delete/', ListingDeleteVew.as_view(), name='listing_delete'),
    path('listings/<str:slug>/update/', update_listing, name='listing_update'),
    path('get-category-detail/<str:category_slug>/', get_category_detail, name='get_category_detail'),
    path('listings/<str:slug>/delete-image/<str:image_id>/', delete_listing_image, name='delete_listing_image'),
]
