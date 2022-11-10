from typing import List

from pydantic import BaseModel, BaseSettings


class KeyPair(BaseModel):
    id: str
    signing_key: str
    verification_key: str


class AppConfig(BaseSettings):
    NAME = "some-service"
    DEBUG = False
    TIMEZONE = "UTC"
    # use first keypair to sign, and rest are rotated keys which should only be used to verify
    KEYS: List[KeyPair] = []
    OAUTH_APPLE_AUD = "host.exp.Exponent"  # TODO: replace after ejecting from expo
    OAUTH_GOOGLE_AUD = "226205689391-7cvoq5ionp176vnmbsiphempn1rt0kp4.apps.googleusercontent.com"


config = AppConfig()


with open("secrets/private.pem") as private, open("secrets/public.pem") as public:
    config.KEYS = [
        KeyPair(
            id="test",
            signing_key=private.read().strip(),
            verification_key=public.read().strip(),
        )
    ]

assert len(config.KEYS) > 0, "should have atleast one key pair"
