import logging
from enum import Enum

from fastapi import APIRouter

from svc.common import BaseModel

logger = logging.getLogger(__name__)


class ExchangeTokenRequest(BaseModel):
    class Providers(Enum):
        apple = "apple"
        google = "google"

    token: str
    provider: Providers


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenPairResponse(BaseModel):
    access_token: str
    refresh_token: str


router = APIRouter(tags=["auth"])


@router.post("/exchange-token", response_model=TokenPairResponse)
async def exchange_token(req: ExchangeTokenRequest):
    """
    given credentials get token pair
    """
    return TokenPairResponse(access_token="access_token", refresh_token="refresh_token")


@router.post("/refresh-token", response_model=TokenPairResponse)
async def refresh_token(req: RefreshTokenRequest):
    """
    given refresh token, get new token pair
    """
    return TokenPairResponse(access_token="access_token", refresh_token="refresh_token")
