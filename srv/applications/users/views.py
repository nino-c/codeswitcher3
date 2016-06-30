#!/usr/bin/env python
# -*- coding: utf-8 -*-
from rest_framework import mixins, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from srv.applications.users.models import User
from srv.applications.users.serializers import UserSerializer

#@permission_classes((IsAuthenticated, ))
class UserViewSet(mixins.ListModelMixin,
                  mixins.RetrieveModelMixin,
                  viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
 
