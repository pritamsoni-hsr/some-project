import json

from svc.app import app


def get_openapi_schema(filename="openapi.json"):
    with open(filename, "w") as f:
        f.write(json.dumps(app.openapi(), indent=2))
