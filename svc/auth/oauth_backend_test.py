from unittest.mock import MagicMock, patch

import pytest
from requests import Response

from . import oauth_backend


def test_apple_backend_token_decode():
    token = "eyJraWQiOiJmaDZCczhDIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoiaG9zdC5leHAuRXhwb25lbnQiLCJleHAiOjE2NjY2MjM4ODYsImlhdCI6MTY2NjUzNzQ4Niwic3ViIjoiMDAwOTgxLmRiYTFmMTFiNjQ3MjQ3YjhiNDQ1MWYwNWM0ODJjNzY0LjIzMjciLCJjX2hhc2giOiJUVmhwYThZTDlMc01oOXVMNldDekpRIiwiZW1haWwiOiI5M2Vjbnh1Zjc4QHByaXZhdGVyZWxheS5hcHBsZWlkLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImlzX3ByaXZhdGVfZW1haWwiOiJ0cnVlIiwiYXV0aF90aW1lIjoxNjY2NTM3NDg2LCJub25jZV9zdXBwb3J0ZWQiOnRydWV9.hWJSMHn4BUetPNNAxIbIW96I8gW6uQts2N-CPDvsmEfygLOhysUhBCtfS68SCRrBA7d4UBXPqkmJ0h_JTZ4Au7qOp3FSQQp8UXouhIXQj5_1F6hwelx2AY9gqAE9bLIzqn18V3PuLDVYE-jNQFmtuYyAN7lW_cK6lxdAo0J5NlPspMejAQwWz7NTt_SIehTL0Mw0Yo-McbtOXLv71Egd4p6LsmuDGFGIXrw9P6k18Qi2nTWl7HvIa-Ng2LAYzFz96m4bwWMDGCxC-pUgc6xffMBTV_FkvPioPhhCzXAHKMJfRT3M92FbP0lfVgcBDC2OzXlTuniOXaGVQTaSAlKu5Q"  # noqa
    # token is expired but it should be able to decode payload
    payload = oauth_backend.apple_backend.decode(token=token, verify=False)
    assert payload["c_hash"] == "TVhpa8YL9LsMh9uL6WCzJQ"

    with pytest.raises(ValueError):
        oauth_backend.apple_backend.decode(token=token, verify=True)


@patch("requests.get")
def test_google_auth(mocked: MagicMock):
    response = Response()
    response.json = lambda: {}
    mocked.return_value = response

    assert isinstance(oauth_backend.GoogleBackend().keys, dict), "google public should be a dict"
    mocked.assert_called_once_with(oauth_backend.GoogleBackend.url)


@patch("requests.get")
def test_apple_auth(mocked: MagicMock):
    response = Response()
    response.json = lambda: {"keys": []}
    mocked.return_value = response

    assert isinstance(oauth_backend.AppleBackend().keys, dict), "apple public should be a dict"
    mocked.assert_called_once_with(oauth_backend.AppleBackend.url)


@patch("requests.get")
def test_should_use_keys_if_passed(mocked: MagicMock):
    class BackendWithKeys(oauth_backend.OAuthBackend):
        keys = {"kid": "public_key"}

        def decode(self, token: str, verify: bool):
            return

    _ = BackendWithKeys()
    mocked.assert_not_called(), "should not try to fetch public keys but use the ones defined locally"
