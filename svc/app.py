from fastapi import FastAPI
from fastapi.routing import APIRoute

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
