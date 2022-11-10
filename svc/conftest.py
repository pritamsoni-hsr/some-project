import asyncio
import sys

import pytest
from tortoise import Tortoise

DB_URL = "sqlite://:memory:"


@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


@pytest.fixture(scope="session")
def event_loop():
    return asyncio.get_event_loop()


async def init_db(db_url, create_db: bool = False, generate_schemas: bool = False) -> None:
    """Initial database connection"""
    await Tortoise.init(db_url=db_url, modules={"models": ["svc.models"]}, _create_db=create_db)
    if not create_db:
        print("failed to create test db")
        sys.exit(1)
    if generate_schemas:
        await Tortoise.generate_schemas()


@pytest.fixture(scope="package", autouse=True)
async def initialize_tests():
    await init_db(db_url=DB_URL, create_db=True, generate_schemas=True)
    yield
    await Tortoise._drop_databases()
