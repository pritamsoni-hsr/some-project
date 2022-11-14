import pytest
from fastapi import exceptions
from freezegun import freeze_time

from svc.utils import get_user

access_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6InRlc3QiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjoicmFuZG9tIiwic3ViIjoicmFuZG9tIiwiaWF0IjoxNjY4MTI0ODAwLCJpc3MiOiJzb21lLXNlcnZpY2UiLCJleHAiOjE2NjkzMzQ0MDAsImp0aSI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIn0.YBuQYd3IXD9kLpJH9Y8W7IwrE1GPURd94blyrryc9zTrIRnxeNIUVmm1Fawga3753SLkZ5R94pGSL78BR6BFD7g7egikA1EXYSY7W2veHFGMl6d4PjTvjkqOS2XAl-7Lgxrqtrtd9x96t-PHZy7e9Ibc1Px64Bg5mC-wvd9sEyG6w5URF1e9T_riuEe0L1dilspyVhYRLHHKtp3c5KWs-BSbgUQFZvLtFCyypIDNMWmtA0fWJNWZCxROv_o6wifQvc875VuG3EI8RLSsLwHq6yhMldn1BpRpnNXFHKeDbVeT03S-GhwYbQTF88awttKTUWoPBvDrh5H6polVHzHWHQ"  # noqa


@freeze_time("2022-11-11")
def test_get_user_from_token():
    u = get_user(f"Bearer {access_token}")
    assert u.id == "random"

    with pytest.raises(exceptions.HTTPException):
        get_user("None")
    with pytest.raises(exceptions.HTTPException):
        get_user("Bearer None")
    with pytest.raises(exceptions.HTTPException):
        get_user("Bearer ")
    with pytest.raises(exceptions.HTTPException):
        get_user("Bearer None Token")
