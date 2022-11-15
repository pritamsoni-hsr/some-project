import pytest
import requests
from fastapi import exceptions
from freezegun import freeze_time

from svc.utils import get_user

access_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6InRlc3QiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjoicmFuZG9tIiwic3ViIjoicmFuZG9tIiwiaWF0IjoxNjY4MTI0ODAwLCJpc3MiOiJzb21lLXNlcnZpY2UiLCJleHAiOjE2NjkzMzQ0MDAsImp0aSI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIn0.YBuQYd3IXD9kLpJH9Y8W7IwrE1GPURd94blyrryc9zTrIRnxeNIUVmm1Fawga3753SLkZ5R94pGSL78BR6BFD7g7egikA1EXYSY7W2veHFGMl6d4PjTvjkqOS2XAl-7Lgxrqtrtd9x96t-PHZy7e9Ibc1Px64Bg5mC-wvd9sEyG6w5URF1e9T_riuEe0L1dilspyVhYRLHHKtp3c5KWs-BSbgUQFZvLtFCyypIDNMWmtA0fWJNWZCxROv_o6wifQvc875VuG3EI8RLSsLwHq6yhMldn1BpRpnNXFHKeDbVeT03S-GhwYbQTF88awttKTUWoPBvDrh5H6polVHzHWHQ"  # noqa


def make_request(token: str):
    r = requests.Request()
    r.headers["Authorization"] = token
    return r


@freeze_time("2022-11-11")
@pytest.mark.anyio
async def test_get_user_from_token():
    u = await get_user(make_request(f"Bearer {access_token}"))
    assert u.id == "random"

    with pytest.raises(exceptions.HTTPException):
        await get_user(make_request(None))
    with pytest.raises(exceptions.HTTPException):
        await get_user(make_request(""))
    with pytest.raises(exceptions.HTTPException):
        await get_user(make_request("None"))
    with pytest.raises(exceptions.HTTPException):
        await get_user(make_request("Bearer None"))
    with pytest.raises(exceptions.HTTPException):
        await get_user(make_request("Bearer "))
    with pytest.raises(exceptions.HTTPException):
        await get_user(make_request("Bearer None Token"))
