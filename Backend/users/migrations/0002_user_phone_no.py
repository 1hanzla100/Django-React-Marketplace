# Generated by Django 3.2.9 on 2021-11-11 09:42

from django.db import migrations
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='phone_no',
            field=phonenumber_field.modelfields.PhoneNumberField(default='+923114018877', max_length=128, region=None),
            preserve_default=False,
        ),
    ]
