# Generated by Django 4.2.10 on 2024-06-15 04:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0016_customuser_points"),
    ]

    operations = [
        migrations.AddField(
            model_name="searchlog",
            name="ip",
            field=models.CharField(default=None, max_length=100),
        ),
        migrations.AlterField(
            model_name="comment",
            name="admin_selected",
            field=models.BooleanField(default=True),
        ),
    ]
