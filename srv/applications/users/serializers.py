#!/usr/bin/env python
# -*- coding: utf-8 -*-
from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):

    class Meta(object):
        model = User
        fields = ('id', 'email', 'name', 'is_admin', 'is_active',)
