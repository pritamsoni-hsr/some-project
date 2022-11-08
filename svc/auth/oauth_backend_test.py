from unittest.mock import MagicMock, patch

from requests import Response

from . import oauth_backend


# hitting real oauth servers
def test_google_backend():
    google_backend = oauth_backend.GoogleBackend()
    assert isinstance(google_backend.keys, dict), "google public should be a dict"


def test_apple_backend():
    apple_backend = oauth_backend.AppleBackend()
    assert isinstance(apple_backend.keys, list), "apple public should be a list"


@patch("requests.get")
def test_google_auth(mocked: MagicMock):
    response = Response()
    response.json = lambda: {}
    mocked.return_value = response

    google_backend = oauth_backend.GoogleBackend()
    assert isinstance(google_backend.keys, dict), "google public should be a dict"
    mocked.assert_called_once_with(oauth_backend.GoogleBackend.url)


@patch("requests.get")
def test_apple_auth(mocked: MagicMock):
    response = Response()
    response.json = lambda: {"keys": []}
    mocked.return_value = response

    apple_backend = oauth_backend.AppleBackend()
    assert isinstance(apple_backend.keys, list), "apple public should be a list"
    mocked.assert_called_once_with(oauth_backend.AppleBackend.url)


@patch("requests.get")
def test_should_use_keys_if_passed(mocked: MagicMock):
    class BackendWithKeys(oauth_backend.OAuthBackend):
        keys = {"kid": "public_key"}

        def decode(self, token: str, verify: bool):
            return

    _ = BackendWithKeys()
    mocked.assert_not_called(), "should not try to fetch public keys but use the ones defined locally"
