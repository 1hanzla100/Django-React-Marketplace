from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt import views as jwt_views
# DRF YASG
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Atlas API",
        default_version="v1",
        description="",
        contact=openapi.Contact(email="hanzla.tauqeer123@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=False,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    # ? Simple JWT URLs
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', jwt_views.TokenVerifyView.as_view(), name='token_verify'),
    # ? App URLs
    path('api/users/', include('users.urls')),
    path('api/mart/', include('mart.urls')),
    # ? Auth with Djoser
    path('api/authentication/', include('djoser.urls')),
    path('api/authentication/social/', include('djoser.social.urls')),
    # ? Swagger
    path('api/docs/', schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui",)
]


if settings.DEBUG is not False:
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
