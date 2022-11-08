from pydantic import BaseSettings


class AppConfig(BaseSettings):
    DEBUG = False


config = AppConfig()
