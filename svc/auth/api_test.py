import pytest

from . import api


@pytest.mark.anyio
async def test_exchange_token():
    response = await api.exchange_token(
        api.ExchangeTokenRequest(
            token="header.body.sign",
            provider=api.ExchangeTokenRequest.Providers.apple,
        )
    )
    assert response == api.TokenPairResponse(access_token="access_token", refresh_token="refresh_token")


@pytest.mark.anyio
async def test_refresh_token():
    response = await api.refresh_token(api.RefreshTokenRequest(refresh_token="header.body.sign"))
    assert response == api.TokenPairResponse(access_token="access_token", refresh_token="refresh_token")
