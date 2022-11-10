from unittest.mock import patch

from svc.config import KeyPair

from .backend import AccessToken, RefreshToken

payload = dict(user_id="abc")
token = "eyJhbGciOiJIUzI1NiIsImtpZCI6InRlc3QiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjoiYWJjIn0.xVnEF23P0ONgUOhtbeXYf4AKN_HbwkuW5qfIFDQ_Qrg"  # noqa


@patch("svc.auth.backend.Token.set_iat")
@patch("svc.auth.backend.Token.set_iss")
@patch("svc.auth.backend.Token.set_exp")
@patch("svc.auth.backend.Token.set_jti")
def test_access_token_provider(*args):
    access_token = AccessToken(payload=payload)
    assert access_token.token(key=KeyPair(id="test", verification_key="abc", signing_key="abc"), alg="HS256") == token


@patch("svc.auth.backend.Token.set_iat")
@patch("svc.auth.backend.Token.set_iss")
@patch("svc.auth.backend.Token.set_exp")
@patch("svc.auth.backend.Token.set_jti")
def test_refresh_token_provider(*args):
    refresh_token = RefreshToken(payload=payload)
    assert refresh_token.token(key=KeyPair(id="test", verification_key="abc", signing_key="abc"), alg="HS256") == token
