# Generated by Django 5.0.1 on 2024-03-22 02:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0011_customuser_notification"),
    ]

    operations = [
        migrations.RenameField(
            model_name="searchlog", old_name="analogies", new_name="prompt",
        ),
        migrations.AddField(
            model_name="searchlog", name="tmp", field=models.FloatField(default=0.0),
        ),
    ]