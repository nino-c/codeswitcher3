#!/usr/bin/env python
# -*- coding: utf-8 -*-
from django.apps import AppConfig


class UsersConfig(AppConfig):
    name = 'srv.applications.users'

    def ready(self):
        from srv.applications.users import signals
