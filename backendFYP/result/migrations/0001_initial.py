# Generated by Django 2.2 on 2021-04-18 14:59

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0003_remove_teacher_uniqueid'),
    ]

    operations = [
        migrations.CreateModel(
            name='MCQResult',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('qid', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), size=None)),
                ('ans_chosen', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), size=None)),
                ('score', models.IntegerField()),
                ('date', models.DateField()),
                ('student_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.Student')),
            ],
        ),
    ]