from unittest.mock import MagicMock, patch
from uuid import UUID
from freezegun import freeze_time
import pytest
from requests import Response

from svc.config import config

from . import api, oauth_backend

access_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6InRlc3QiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjoicmFuZG9tIiwic3ViIjoicmFuZG9tIiwiaWF0IjoxNjY4MTI0ODAwLCJpc3MiOiJzb21lLXNlcnZpY2UiLCJleHAiOjE2NjkzMzQ0MDAsImp0aSI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIn0.YBuQYd3IXD9kLpJH9Y8W7IwrE1GPURd94blyrryc9zTrIRnxeNIUVmm1Fawga3753SLkZ5R94pGSL78BR6BFD7g7egikA1EXYSY7W2veHFGMl6d4PjTvjkqOS2XAl-7Lgxrqtrtd9x96t-PHZy7e9Ibc1Px64Bg5mC-wvd9sEyG6w5URF1e9T_riuEe0L1dilspyVhYRLHHKtp3c5KWs-BSbgUQFZvLtFCyypIDNMWmtA0fWJNWZCxROv_o6wifQvc875VuG3EI8RLSsLwHq6yhMldn1BpRpnNXFHKeDbVeT03S-GhwYbQTF88awttKTUWoPBvDrh5H6polVHzHWHQ"  # noqa
refresh_token = "eyJhbGciOiJSUzI1NiIsImtpZCI6InRlc3QiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjoicmFuZG9tIiwic3ViIjoicmFuZG9tIiwiaWF0IjoxNjY4MTI0ODAwLCJpc3MiOiJzb21lLXNlcnZpY2UiLCJleHAiOjE2NzI5NjMyMDAsImp0aSI6IjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwIn0.PL25LHKnagvV37-ZwDweRtRzBJ6Ht1pr1qWempe0yvRYFOYn7-7wxhDOdLXTdK_owgWN6OcUNW-DJ938biheKWOORI15jaKAg_pGJ5fnTP9WZdMsDBNy2njxeZuzxGKQgvyaAT7oSq0cLADEH1NEPNHGVLlp5ystB30i4gJmGY09DPibuwr2m7BSjluE5yZHnj9a1gXJvGvmiGdnjcEvNSXcRy4KmE7uIVkYhxODxRJWJGNVCauEsCCh5gRnzjOAPu2laiNR7NlXdN8O-o_R00G2_nNopoJt4vAhinZGt3CVKFK_YyAgkBvMnHKlycKR-ZPxc23QV3g632I-M_OHSw"  # noqa


@freeze_time("2022-11-11")
@patch("ulid.ULID.from_timestamp")
@patch("svc.auth.backend.uuid4")
@patch("svc.auth.oauth_backend.google_backend.decode")
@patch("requests.get")
@pytest.mark.anyio
async def test_exchange_token(
    mocked: MagicMock, oauth_google_backend: MagicMock, mocked_uuid: MagicMock, mocked_ulid: MagicMock
):
    oauth_google_backend.return_value = {"sub": "random", "email_verified": True}
    mocked_ulid.return_value = "test_exchange_token"
    response = Response()
    mocked_uuid.return_value = UUID("00000000-0000-0000-0000-000000000000")
    response.json = lambda: {"test": config.KEYS[0].verification_key}
    mocked.return_value = response
    response = await api.exchange_token(
        api.ExchangeTokenRequest(token=access_token, provider=api.ExchangeTokenRequest.Providers.google)
    )
    assert response == api.TokenPairResponse(
        access_token="eyJhbGciOiJSUzI1NiIsImtpZCI6InRlc3QiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjoidGVzdF9leGNoYW5nZV90b2tlbiIsInN1YiI6InRlc3RfZXhjaGFuZ2VfdG9rZW4iLCJpYXQiOjE2NjgxMjQ4MDAsImlzcyI6InNvbWUtc2VydmljZSIsImV4cCI6MTY2OTMzNDQwMCwianRpIjoiMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAifQ.lEpgYYxyo0NUJmGSys3oxh1afgdBGfwqowQvee3Zx60Gy2b-yPNE_sOWYqOGW5rQ-S0NEUug_Bb6yO8GT12O2CRguWHoeZLPuZ8541tPwO6dyou6jEEM1i2wnJtJJffcZagv2tCrMDIappBTG_HV5rG9uT03QNlqIdmzZRoSKKmsL2JxlqmX4fBl4yRN86ZiP-H01Vo3ZfxQSI0FPef1e1spaU5a10tZP61eKgltWtslNL1_NUhTlXfYIRh2XEWrOouoA_H8NIIavUvoSXKAyIQ26RZ0T2qKARY9fssYLdUuvMCZrvz6k7Hy2qfCwgfzp_Ih1HcOHmK7p_D_ONBK_w",  # noqa
        refresh_token="eyJhbGciOiJSUzI1NiIsImtpZCI6InRlc3QiLCJ0eXAiOiJKV1QifQ.eyJ1c2VyX2lkIjoidGVzdF9leGNoYW5nZV90b2tlbiIsInN1YiI6InRlc3RfZXhjaGFuZ2VfdG9rZW4iLCJpYXQiOjE2NjgxMjQ4MDAsImlzcyI6InNvbWUtc2VydmljZSIsImV4cCI6MTY3Mjk2MzIwMCwianRpIjoiMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAifQ.XpRA5Bfe1HxTGbxduLQBn1OuuK9x2W14dzm40g-NwtkjEmBnNceZw_ULFIbsF8DoPFccc7vxcfiIglo2ydoLuDsAVYNbwjTA2LnTwEInDn4pGlUFGaInhgWukTDYyYM1QvTDlA03Xri3GLwuvT4xSY99FV_rYWHQHZdQY5C_3o1lgpuK5BkwXgeX6esaVyCyp2siy-93AGsSjv3o90t2VgG7lBGJ0j1CiiDnfDgz-ZksejcowCWtJrpujtBbH4vN9FA97ITByY6EBSt7hQmw2jRaC-86_WdhgHevTRd7tn4qQ8dRn1p8FWME94ontj-jfhk0IXZgeig5RGKYXPTEfg",  # noqa
    )


@patch("svc.auth.backend.uuid4")
@freeze_time("2022-11-11")
@pytest.mark.anyio
async def test_refresh_token(mocked_uuid: MagicMock):
    mocked_uuid.return_value = UUID("00000000-0000-0000-0000-000000000000")
    response = await api.refresh_token(api.RefreshTokenRequest(refresh_token=access_token))
    assert response == api.TokenPairResponse(access_token=access_token, refresh_token=refresh_token)


class BackendWithKeys(oauth_backend.OAuthBackend):
    name = "dummy"
    keys = {"kid": "public_key"}

    def decode(self, token: str, verify: bool = True):
        return {"sub": "user-id", "email_verified": True}


@pytest.mark.anyio
@patch("ulid.ULID.from_timestamp")
async def test_exchange_oauth_core(mocked: MagicMock):
    dummy_backend = BackendWithKeys()
    mocked.return_value = "random"
    user = await api.exchange_oauth_token(access_token, backend=dummy_backend)
    assert user is not None
    assert user.id == "random"
    mocked.assert_called_once()


class BackendWithKeys_not_verified(BackendWithKeys):
    def decode(self, token: str, verify: bool = True):
        return {"sub": "user-id", "email_verified": False}


@pytest.mark.anyio
async def test_exchange_oauth_core_with_unauthenticated_user():
    dummy_backend = BackendWithKeys_not_verified()
    user = await api.exchange_oauth_token(access_token, backend=dummy_backend)
    assert user is None
