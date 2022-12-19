from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from tortoise.contrib.fastapi import register_tortoise

import svc.logger  # noqa
from svc import auth, wallet, wallet_category
from svc.config import config


def get_method_name(route: APIRoute):
    # use same method names across BE and FE.
    return route.name


app = FastAPI(
    debug=config.DEBUG,
    generate_unique_id_function=get_method_name,
    servers=[{"url": "http://192.168.0.197:8000", "description": "development server"}],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


@app.get("/health", response_model=bool)
def health():
    return True


app.include_router(router=auth.router, prefix="/auth")
app.include_router(router=wallet_category.router, prefix="/wallets")
app.include_router(router=wallet.router, prefix="/wallets")

register_tortoise(
    app=app,
    db_url=config.DATABASE_CONN,
    modules={"models": ["svc.models"]},
    add_exception_handlers=True,
    generate_schemas=True,
)
