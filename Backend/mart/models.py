from django.db import models
from django.conf import settings
from django.dispatch import receiver
from .utils import unique_slug_generator_by_name, unique_slug_generator_by_title
from django.db.models.signals import post_save
# Create your models here.


class CategoryType(models.Model):
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=500, blank=True, null=True)
    type = models.ForeignKey(CategoryType, related_name="categories", on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Listing(models.Model):
    class ConditionChoices(models.TextChoices):
        NEW = 'NEW', 'New'
        USED_LIKE_NEW = 'USED_LIKE_NEW', 'Used - Like New'
        USED_GOOD = 'USED_GOOD', 'Useed - Good'
        USED_FAIR = 'USED_FAIR', 'Used - Fair'

    title = models.CharField(max_length=100)
    slug = models.SlugField(max_length=500, blank=True, null=True)
    description = models.TextField()
    price = models.IntegerField()
    category = models.ForeignKey(Category, related_name="listings", on_delete=models.CASCADE)
    condition = models.CharField(
        max_length=13,
        choices=ConditionChoices.choices,
        default=ConditionChoices.NEW,
    )
    offer_delivery = models.BooleanField(default=False)
    public_meetup = models.BooleanField(default=False)
    door_pickup = models.BooleanField(default=False)
    drop_off = models.BooleanField(default=False)
    location_longitude = models.DecimalField(max_digits=9, decimal_places=6)
    location_latitude = models.DecimalField(max_digits=9, decimal_places=6)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='listings', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return self.title


class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to='atlas_mart/listing_images')

    def __str__(self):
        return self.listing.title


@receiver(post_save, sender=Category)
def question_slug_generator(sender, instance, created, **kwargs):
    if created:
        instance.slug = unique_slug_generator_by_name(instance)
        instance.save()


@receiver(post_save, sender=Listing)
def tag_slug_generator(sender, instance, created, **kwargs):
    if created:
        instance.slug = unique_slug_generator_by_title(instance)
        instance.save()
