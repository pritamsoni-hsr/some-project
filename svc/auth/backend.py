import datetime
import logging
from typing import Any, Dict, Optional, Tuple
from uuid import uuid4

import jwt
from fastapi import HTTPException, Request

from svc.common import LazyUser
from svc.config import config

logger = logging.getLogger(__name__)


class TokenError(Exception):
    def __init__(self, message: str = None) -> None:
        self.message = message

    def __str__(self) -> str:
        return self.message


class Token:
    token_type: str
    issuer = config.NAME
    leeway = datetime.timedelta(minutes=5)
    lifetime = datetime.timedelta(weeks=2)

    def __init__(self, payload=dict()) -> None:
        self.payload = payload
        self.current_time = datetime.datetime.utcnow()

    def set_iss(self):
        """
        set issuer
        """
        self.payload["iss"] = self.issuer

    def set_jti(self):
        """
        jwt id
        see also: https://tools.ietf.org/html/rfc7519#section-4.1.7
        """
        self.payload["jti"] = uuid4().hex

    def set_exp(self, claim="exp", from_time=None, lifetime=None):
        """
        expiration time
        see also: https://tools.ietf.org/html/rfc7519#section-4.1.4
        """
        if from_time is None:
            from_time = self.current_time

        if lifetime is None:
            lifetime = self.lifetime

        self.payload[claim] = (from_time + lifetime).timestamp()

    def set_iat(self, claim="iat", at_time=None):
        """
        issued at time
        see also: https://tools.ietf.org/html/rfc7519#section-4.1.6
        """
        if at_time is None:
            at_time = self.current_time

        self.payload[claim] = (at_time).timestamp()

    def check_exp(self, claim="exp", current_time=None):
        """
        Checks whether a timestamp value in the given claim has passed (since
        the given datetime value in `current_time`).  Raises a TokenError with
        a user-facing error message if so.
        """
        if current_time is None:
            current_time = self.current_time

        try:
            claim_value = self.payload[claim]
        except KeyError:
            raise TokenError(f"Token has no '{claim}' claim")

        claim_time = datetime.datetime.utcfromtimestamp(claim_value)

        if claim_time <= current_time - self.leeway:
            raise TokenError(f"Token '{claim}' claim has expired")

    def token(self, key: str, alg: str) -> str:
        self.set_iat()
        self.set_iss()
        self.set_exp()
        self.set_jti()
        return jwt.encode(self.payload, key=key, algorithm=alg)


class AccessToken(Token):
    token_type: str = "access_token"


class RefreshToken(Token):
    token_type: str = "refresh_token"
    lifetime = datetime.timedelta(weeks=8)


class JWTBackend:
    alg = "RS256"  # just use asymmetric
    keys = config.KEYS

    def get_user(self, token: str) -> Optional[LazyUser]:
        payload = self.decode(token=token, verify=True)
        if payload:
            return LazyUser(id="eff64e00a0124887821a1b4ae5ec624c")
        return None

    def get_payload(self, token: str) -> Tuple[Dict, bool]:
        return {}, False

    def for_user(self, user: LazyUser) -> Tuple[str, str]:
        """
        Returns an authorization token for the given user that will be provided
        after authenticating the user's credentials.
        """
        # always sign with first key
        key_pair = self.keys[0]

        access_token = AccessToken(dict(user_id=user.id, sub=user.id)).token(key=key_pair.signing_key, alg=self.alg)
        refresh_token = RefreshToken(dict(user_id=user.id, sub=user.id)).token(key=key_pair.signing_key, alg=self.alg)

        return access_token, refresh_token.token

    def decode(self, token: str, verify: bool = True) -> Any:
        for keypair in self.keys:
            decoded = self.decode_single(token, key=keypair.verification_key, verify=verify)
            if decoded:
                return decoded
        return None

    def decode_single(self, token: str, key: str, verify: bool) -> Any | bool:
        # TODO: improve error handling
        try:
            return jwt.decode(
                token,
                key=key,
                verify=verify,
                algorithms=[self.alg],
                audience=self.aud,
            )
        except BaseException as e:
            logger.error("failed to verify user token", e)
        return False


jwt_backend = JWTBackend()


def extract_user(r: Request):
    token = r.headers.get("authorization")
    user = jwt_backend.get_user(token)
    if user:
        return user
    raise HTTPException(status_code=401, detail="unauthorized")
