from pathlib import Path

from .openapi import get_openapi_schema


def test_get_openapi_schema():
    get_openapi_schema()
    # should have a new file
    schema = Path("openapi.json")
    assert schema.exists(), "openapi.json should exist"
    assert schema.is_file(), "schema should be a file"
    # cleanup
    schema.unlink()
