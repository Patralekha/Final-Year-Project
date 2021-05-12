# Generated by Django 2.2 on 2021-05-12 14:21

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_remove_teacher_uniqueid'),
        ('result', '0003_auto_20210426_1622'),
    ]

    operations = [
        migrations.CreateModel(
            name='SubjectiveResult',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('subject_id', models.IntegerField(default=0)),
                ('qid', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), size=None)),
                ('ans_chosen', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=250), size=None)),
                ('score', django.contrib.postgres.fields.ArrayField(base_field=models.DecimalField(decimal_places=2, max_digits=10), size=None)),
                ('date', models.DateField()),
                ('student_id', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='users.Student')),
            ],
        ),
    ]
