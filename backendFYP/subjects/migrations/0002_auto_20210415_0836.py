# Generated by Django 2.2 on 2021-04-15 08:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('subjects', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='topic',
            old_name='topicI_id',
            new_name='topic_id',
        ),
    ]
