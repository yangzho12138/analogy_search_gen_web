# Generated by Django 5.0.1 on 2024-02-23 14:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0005_alter_issue_admin_comment_alter_issue_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="free_openai_api_key",
            field=models.IntegerField(default=50),
        ),
    ]
