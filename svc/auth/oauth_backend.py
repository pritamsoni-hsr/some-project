import logging
from abc import ABC, abstractmethod
from typing import Any, Optional

import requests
from google.auth.jwt import decode as google_decode
from jwt import decode as jwt_decode
from jwt.algorithms import RSAAlgorithm

from svc.config import config

logger = logging.getLogger(__name__)


class OAuthBackend(ABC):
    name: str
    url: str  # url to access public keys
    aud: Optional[str] = None
    keys: Optional[Any] = None

    def __init__(self) -> None:
        if not hasattr(self, "url") and not self.keys:
            raise ValueError("one of **url** and **keys** is required for oauth backend.")
        self._get_keys()

    def _get_keys(self):
        if not self.keys:
            self.keys = requests.get(self.url).json()

    @abstractmethod
    def decode(self, token: str, verify: bool) -> Any:
        raise NotImplementedError()


class GoogleBackend(OAuthBackend):
    name = "google"
    url = "https://www.googleapis.com/oauth2/v1/certs"
    aud = config.OAUTH_GOOGLE_AUD

    def decode(self, token: str, verify: bool = True) -> Any:
        return google_decode(token, certs=self.keys, verify=verify, audience=self.aud)


class AppleBackend(OAuthBackend):
    name = "apple"
    url = "https://appleid.apple.com/auth/keys"
    aud = config.OAUTH_APPLE_AUD

    def _get_keys(self):
        # apple returns {"keys":[list of keys]}
        super()._get_keys()
        if isinstance(self.keys, dict):
            self.keys = self.keys.get("keys")

    def decode(self, token: str, verify: bool = True) -> Any:
        for jwk in self.keys:
            decoded = self.decode_single(token, key=RSAAlgorithm.from_jwk(jwk), verify=verify)
            if decoded:
                return decoded
        return None

    def decode_single(self, token: str, key: str, verify: bool) -> Any | bool:
        # TODO: improve error handling
        try:
            return jwt_decode(
                token,
                key=key,
                verify=verify,
                algorithms=["RS256"],
                audience=self.aud,
            )
        except BaseException as e:
            logger.error("failed to verify user token", e)
        return False


if __name__ == "__main__":
    apple_backend = AppleBackend()
    google_backend = GoogleBackend()
