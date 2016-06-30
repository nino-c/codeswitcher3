#!/usr/bin/env python
# -*- coding: utf-8 -*-
from django.conf.urls import include
from django.conf.urls import url
from django.contrib import admin

from django.conf import settings
from django.conf.urls.static import static

#from rest_framework_extensions.routers import DefaultRouter
from rest_framework_extensions.routers import (
    ExtendedSimpleRouter as SimpleRouter
)

from srv.applications.users.views import UserViewSet
from srv.applications.authentication.views import AuthenticationViewSet
from srv.applications.game.views import *
from srv.applications.game import urls as gameurls
from srv.applications.profiles import urls as profileurls

#import  srv.applications.symbolic_math

#from .settings import MEDIA_ROOT

api_router = SimpleRouter()
api_router.register(r'users',                UserViewSet)
api_router.register(r'auth',                 AuthenticationViewSet)
api_router.register(r'categories',           CategoryViewSet)
api_router.register(r'categories-with-apps', CategoryAppsViewSet)
api_router.register(r'apps',                 AppViewSet)
api_router.register(r'apps-minimal',         AppMinimalViewSet)
api_router.register(r'instances',            InstanceViewSet)
api_router.register(r'snapshots',            SnapshotViewSet)
api_router.register(r'code_modules',         CodeModuleViewSet)
api_router.register(r'instances-ordered',    OrderedInstancesViewSet)


urlpatterns = [
    url(r'^api/', include(api_router.urls)),
    url(r'^admin/', admin.site.urls),
    url(r'^game/', include(gameurls, namespace='game')),
    url(r'^profiles/', include(profileurls, namespace='profiles')),
    url(r'^symbolic_math/', include('srv.applications.symbolic_math.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
#urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
