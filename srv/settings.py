from os.path import dirname, join, exists, abspath
import dj_database_url
import logging.config

# Environment
import environ
env = environ.Env()
DEPLOYMENT_LEVEL = env('DEPLOYMENT_LEVEL')
SECRET_KEY = env('SECRET_KEY')
DATABASE_URL = env('DATABASE_URL')
DEBUG = False

# Paths
ROOT_DIR = dirname(dirname(dirname(abspath(__file__))))
BASE_DIR = dirname(dirname(abspath(__file__)))
LOGFILE_ROOT = join(dirname(BASE_DIR), 'logs')
MEDIA_ROOT = join(BASE_DIR, 'website', 'media')
MEDIA_URL = "/media/"
ANGULAR_APP_DIR = join(ROOT_DIR, 'src')


ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework.authtoken',
    'django_extensions',
    'corsheaders',
    'crispy_forms',
    'easy_thumbnails',

    'srv.applications.common',
    'srv.applications.authentication',
    'srv.applications.users.apps.UsersConfig',
    'srv.applications.profiles',
    'srv.applications.game',
    'srv.applications.symbolic_math',
]

MIDDLEWARE_CLASSES = [
    'corsheaders.middleware.CorsMiddleware',

    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# URLs
ROOT_URLCONF = 'srv.urls'

# Static files (CSS, JavaScript, Images etc.)
STATIC_URL = '/assets/'
STATICFILES_DIRS = [
    #join(BASE_DIR, 'srv/static/'),
    join(BASE_DIR, 'assets/'),
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # 'DIRS': [
        #     join(BASE_DIR, 'srv/static/'),
        #     join(BASE_DIR, 'templates'),
        # ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'srv.wsgi.application'

# Database
DATABASES = {
    # 'default': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME': join(BASE_DIR, 'db.sqlite3'),
    # }
    'default': env.db(),
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    # {
    #     'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    # },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Custom authentication user model
AUTH_USER_MODEL = 'users.User'

# Django REST Framework (DRF) configuration
# @see: http://www.django-rest-framework.org/
REST_FRAMEWORK = {
    # @see: http://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
    ),
    # @see: http://www.django-rest-framework.org/api-guide/permissions/
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
        #'rest_framework.permissions.DjangoModelPermissions',
    ),

    'DEFAULT_PAGINATION_CLASS': 'srv.applications.common.models.Pagination',
    'PAGE_SIZE': 10,
}

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[%(asctime)s] %(levelname)s [%(name)s:%(lineno)s] %(message)s',
            'datefmt': '%d/%b/%Y %H:%M:%S',
        },
        'simple': {
            'format': '%(levelname)s %(message)s',
        },
    },
    'handlers': {
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': 'logs/codeswitcher.log',
            'formatter': 'verbose',
        },
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'propagate': True,
            'level': 'DEBUG',
        },
        'codeswitcher': {
            'handlers': ['console', 'file'],
            'propagate': True,
            'level': 'DEBUG',
        },
    }
}

logging.config.dictConfig(LOGGING)

# Internationalization
LANGUAGE_CODE = 'en-us'
USE_I18N = True
USE_L10N = True

TIME_ZONE = 'UTC'
USE_TZ = True

# CORS:
# @see: https://github.com/ottoyiu/django-cors-headers
CORS_ORIGIN_ALLOW_ALL = True
