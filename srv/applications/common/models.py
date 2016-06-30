#!/usr/bin/env python
# -*- coding: utf-8 -*-
#import uuid
from django.db import models
from rest_framework.response import Response
from rest_framework import pagination



class BaseModel(models.Model):
    #id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta(object):
        abstract = True

class Pagination(pagination.PageNumberPagination):
    def get_paginated_response(self, data):
        return Response(data)
