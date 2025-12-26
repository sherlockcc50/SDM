from django.contrib import admin
from django.urls import path, include
from django.views.static import serve
from pathlib import Path

THUMBNAILS_DIR = Path.home() / "sdm" / "thumbnails"
DOWNLOADS_DIR = Path.home() / "Downloads";


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("nyx.urls")),
    path("thumbnails/<str:path>", serve, {"document_root": THUMBNAILS_DIR}),
    path("downloads/<str:path>", serve, {"document_root": DOWNLOADS_DIR})
]
