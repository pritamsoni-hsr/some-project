from . import oauth_backend


# hitting real oauth servers
def test_google_backend():
    assert isinstance(oauth_backend.google_backend.keys, dict), "google public should be a dict"


def test_apple_backend():
    assert isinstance(oauth_backend.apple_backend.keys, dict), "apple public should be a dict"
