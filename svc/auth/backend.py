import logging
from datetime import datetime, timedelta
from typing import Dict, Optional, Tuple
from uuid import uuid4

import jwt
from fastapi import HTTPException, Request
from google.auth.jwt import decode as google_decode

from svc.auth.utils import datetime_to_epoch
from svc.common import LazyUser
from svc.config import KeyPair, config

logger = logging.getLogger(__name__)


class TokenError(Exception):
    def __init__(self, message: str = None) -> None:
        self.message = message

    def __str__(self) -> str:
        return self.message


class Token:
    token_type: str
    issuer = config.NAME
    leeway = timedelta(minutes=5)
    lifetime = timedelta(weeks=2)

    def __init__(self, payload=dict()) -> None:
        self.payload = payload
        self.current_time = datetime.utcnow()

    def set_iss(self):
        self.payload["iss"] = self.issuer

    def set_jti(self):
        self.payload["jti"] = uuid4().hex

    def set_exp(self, from_time: datetime | None = None):
        if from_time is None:
            from_time = self.current_time

        self.payload["exp"] = datetime_to_epoch(from_time + self.lifetime)

    def set_iat(self, at_time: datetime | None = None):
        if at_time is None:
            at_time = self.current_time

        self.payload["iat"] = datetime_to_epoch(at_time)

    def check_exp(self, current_time: datetime | None = None):
        """
        Checks whether a timestamp value in the given claim has passed (since
        the given datetime value in `current_time`).  Raises a TokenError with
        a user-facing error message if so.
        """
        if current_time is None:
            current_time = self.current_time

        try:
            claim_value = self.payload["exp"]
        except KeyError:
            raise TokenError("Token has no exp claim")

        claim_time = datetime.utcfromtimestamp(claim_value)

        if claim_time <= current_time - self.leeway:
            raise TokenError("Token exp claim has expired")

    def token(self, key: KeyPair, alg: str) -> str:
        self.set_iat()
        self.set_iss()
        self.set_exp()
        self.set_jti()
        headers = dict(alg=alg, kid="test")
        return jwt.encode(self.payload, key=key.signing_key, algorithm=alg, headers=headers)


class AccessToken(Token):
    token_type: str = "access_token"


class RefreshToken(Token):
    token_type: str = "refresh_token"
    lifetime = timedelta(weeks=8)


class JWTBackend:
    alg = "RS256"  # just use asymmetric
    keys = config.KEYS
    aud = config.NAME

    def get_user(self, token: str) -> Optional[LazyUser]:
        payload = self.decode(token=token, verify=True)
        user_id = payload["user_id"]
        if payload:
            return LazyUser(id=user_id)
        return None

    def get_payload(self, token: str) -> Tuple[Dict, bool]:
        return {}, False

    def for_user(self, user: LazyUser) -> Tuple[str, str]:
        """
        Returns an authorization token for the given user that will be provided
        after authenticating the user's credentials.
        """
        # always sign with first key
        params = dict(key=self.keys[0], alg=self.alg)

        payload = dict(user_id=user.id, sub=user.id)
        access_token = AccessToken(payload).token(**params)
        refresh_token = RefreshToken(payload).token(**params)

        return access_token, refresh_token

    def decode(self, token: str, verify: bool = True) -> Optional[LazyUser]:
        keyMap = {}
        for key in self.keys:
            keyMap[key.id] = key.verification_key
        payload = google_decode(token=token, certs=keyMap, verify=verify, audience=None)
        return LazyUser(id=payload["user_id"])


jwt_backend = JWTBackend()


def extract_user(r: Request):
    token = r.headers.get("authorization")
    user = jwt_backend.get_user(token)
    if user:
        return user
    raise HTTPException(status_code=401, detail="unauthorized")
