if True:
    import os
    import sys

    sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import json

from svc.app import app


def get_openapi_schema(filename="openapi.json"):
    with open(filename, "w") as f:
        f.write(json.dumps(app.openapi(), indent=2))


if __name__ == "__main__":
    get_openapi_schema()
