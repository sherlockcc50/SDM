python -m nuitka \
  --standalone \
  --onefile \
  --jobs=8 \
  --module-parameter=django-settings-module=backend.settings \
  --include-package=django \
  --include-package=backend \
  --include-package=nyx \
  --include-data-dir=static=static \
  --include-data-dir=templates=templates \
  --include-data-files=hand_landmarker.task=. \
  --assume-yes-for-downloads \
  --output-dir=dist \
  manage.py
