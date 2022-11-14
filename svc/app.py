from fastapi import FastAPI
from fastapi.routing import APIRoute
from tortoise.contrib.fastapi import register_tortoise

from svc import wallet
from svc.auth import api
from svc.config import config


def custom_generate_unique_id(route: APIRoute):
    # remove repetitive text in message name
    return f"{route.name}"


app = FastAPI(
    debug=config.DEBUG,
    generate_unique_id_function=custom_generate_unique_id,
)


@app.get("/health", response_model=bool)
def health():
    return True


app.include_router(router=api.router, prefix="/auth")
app.include_router(router=wallet.router, prefix="/wallets")

register_tortoise(
    app=app,
    db_url="sqlite://db.sqlite3",
    modules={"models": ["svc.models"]},
    add_exception_handlers=True,
    generate_schemas=True,
)
