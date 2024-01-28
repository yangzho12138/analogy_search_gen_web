# Generated by Django 4.1 on 2024-01-24 20:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="SearchLog",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("query", models.CharField(max_length=1000)),
                ("analogies", models.CharField(max_length=1000)),
                (
                    "user",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="GenLog",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("prompt", models.CharField(max_length=1000)),
                ("target", models.CharField(max_length=100)),
                ("src", models.CharField(max_length=100)),
                ("temp", models.FloatField()),
                ("freq_penalty", models.FloatField()),
                ("pres_penalty", models.FloatField()),
                ("max_length", models.IntegerField()),
                ("top_p", models.FloatField()),
                ("best_of", models.IntegerField()),
                ("analogy", models.CharField(max_length=1000)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
