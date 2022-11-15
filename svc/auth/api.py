import logging
from enum import Enum

from fastapi import APIRouter, Depends, HTTPException
from tortoise import transactions

from svc import models
from svc.common import BaseModel, LazyUser
from svc.utils import get_user
from svc.wallet_expense_categories import create_default_categories

from .backend import jwt_backend
from .oauth_backend import OAuthBackend, apple_backend, google_backend

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
    backend = get_oauth_backend(provider=req.provider)
    user = await exchange_oauth_token(token=req.token, backend=backend)

    access, refresh = jwt_backend.for_user(user)
    return TokenPairResponse(access_token=access, refresh_token=refresh)


@router.post("/refresh-token", response_model=TokenPairResponse)
async def refresh_token(req: RefreshTokenRequest):
    """
    given refresh token, get new token pair
    """
    user = jwt_backend.decode(token=req.refresh_token)

    access, refresh = jwt_backend.for_user(user)
    return TokenPairResponse(access_token=access, refresh_token=refresh)


@router.post("/add-provider", response_model=TokenPairResponse)
async def add_provider(req: ExchangeTokenRequest, user: LazyUser = Depends(get_user)):
    """
    user can add multiple oauth provider to their account so they can login with any provider.
    """
    backend = get_oauth_backend(provider=req.provider)

    oauth_user = backend.decode(token=req.token, verify=True)
    logger.info("associating id_token")

    oauth_conn, created = await models.UserOAuthConnections.get_or_create(
        user_id=user.id,
        id=oauth_user.provider_id,
        provider=backend.name,
    )

    access, refresh = jwt_backend.for_user(user)
    return TokenPairResponse(access_token=access, refresh_token=refresh)


def get_oauth_backend(provider: ExchangeTokenRequest.Providers) -> OAuthBackend:
    if provider == ExchangeTokenRequest.Providers.google:
        return google_backend
    elif provider == ExchangeTokenRequest.Providers.apple:
        return apple_backend

    raise HTTPException(status_code=400, detail="invalid provider")


async def exchange_oauth_token(token: str, backend: OAuthBackend) -> models.User | None:
    """
    exchange oauth change to retrieve the user
    """
    # TODO: better error handling

    oauth_user = backend.decode(token=token)
    provider_id = oauth_user.provider_id

    if not oauth_user.email_verified:
        logger.warning(f"user is not verified, received {oauth_user}")
        return None

    # check if user exists
    user = await models.User.get_or_none(
        oauth__id=provider_id,
        oauth__provider=backend.name,
    )
    if user:
        return user

    logger.info("creating new user from oauth id_token")
    # create user and oauth connection
    try:
        user = await create_user(provider_id=provider_id, provider=backend.name)
        return user
    except BaseException:
        logger.exception("failed to create user from oauth id_token")


@transactions.atomic()
async def create_user(provider_id: str, provider: str) -> models.User:
    # leave username empty
    user = await models.User.create()
    await models.UserOAuthConnections.create(
        user=user,
        id=provider_id,
        provider=provider,
    )
    await create_default_categories(user_id=user.id)
    return user
