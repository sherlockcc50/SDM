import os
import uvicorn

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

if __name__ == "__main__":
    uvicorn.run(
        "backend.asgi:application",
        host="127.0.0.1",
        port=8000,
        reload=False,
        workers=1,
        log_level="info",
    )

