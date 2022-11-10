import logging
from abc import ABC
from functools import cached_property
from typing import Any, Dict, Optional

import requests
from google.auth.jwt import decode as google_decode
from jwt.algorithms import Encoding, PublicFormat, RSAAlgorithm

from svc.config import config

logger = logging.getLogger(__name__)


class OAuthBackend(ABC):
    name: str
    url: str  # url to access public keys
    aud: Optional[str] = None

    def __init__(self) -> None:
        if not hasattr(self, "url") and not self.keys:
            raise ValueError("one of **url** and **keys** is required for oauth backend.")

    @cached_property
    def keys(self) -> Dict[str, Any]:
        return requests.get(self.url).json()

    def decode(self, token: str, verify: bool = True) -> Any:
        return google_decode(token, certs=self.keys, verify=verify, audience=self.aud)


class GoogleBackend(OAuthBackend):
    name = "google"
    url = "https://www.googleapis.com/oauth2/v1/certs"
    aud = config.OAUTH_GOOGLE_AUD


class AppleBackend(OAuthBackend):
    name = "apple"
    url = "https://appleid.apple.com/auth/keys"
    aud = config.OAUTH_APPLE_AUD

    @cached_property
    def keys(self) -> Dict[str, Any]:
        # apple returns {"keys":[list of keys]}
        response = super().keys
        keyMap = {}
        # convert to {kid: public key} format which google jwt verification backend accepts
        for i in response.get("keys"):
            keyMap[i["kid"]] = (
                RSAAlgorithm.from_jwk(i)
                .public_bytes(encoding=Encoding.PEM, format=PublicFormat.SubjectPublicKeyInfo)
                .decode("utf-8")
            )
        return keyMap


apple_backend = AppleBackend()
google_backend = GoogleBackend()
