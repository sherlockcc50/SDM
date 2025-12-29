from pathlib import Path
import os
import json

container = {}
for file in os.listdir():
    container[file] = os.path.expanduser(file)
