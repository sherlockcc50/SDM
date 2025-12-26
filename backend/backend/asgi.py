import os
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from nyx import consumers
from django.urls import path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # normal HTTP
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/status/", consumers.StatusConsumer.as_asgi()),
        ])
    ),
})
