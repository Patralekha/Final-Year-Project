# Generated by Django 2.2 on 2021-04-18 11:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subjects', '0002_auto_20210415_0836'),
    ]

    operations = [
        migrations.AddField(
            model_name='mcqset',
            name='level',
            field=models.CharField(default='Easy', max_length=10),
        ),
    ]
