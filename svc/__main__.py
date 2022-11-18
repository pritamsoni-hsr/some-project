import argparse
import os
import sys
from enum import Enum


class Actions(str, Enum):
    start = "start"
    generate_data = "generate-random-data"
    generate_openapi = "generate-openapi-schema"


parser = argparse.ArgumentParser()
parser.add_argument("--action", default=Actions.start, type=Actions)


if __name__ == "__main__":
    sys.path.append(os.path.dirname(os.path.dirname(__file__)))
    args = parser.parse_args()

    if args.action == Actions.start:
        import uvicorn

        from svc.config import config

        uvicorn.run(
            app="svc.app:app",
            reload=config.DEBUG,
            host="192.168.0.197" if config.DEBUG else "0.0.0.0",
            reload_includes=["svc"],
        )

    if args.action == Actions.generate_data:
        from svc.generate_data import generate_data

        generate_data()

    if args.action == Actions.generate_openapi:
        from svc.openapi import get_openapi_schema

        get_openapi_schema()
