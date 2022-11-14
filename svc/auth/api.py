import logging
from enum import Enum

from fastapi import APIRouter
from pydantic import ValidationError
from tortoise import transactions

from svc import models
from svc.common import BaseModel
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
    user = None
    if req.provider == ExchangeTokenRequest.Providers.google:
        user = await exchange_oauth_token(token=req.token, backend=google_backend)
    elif req.provider == ExchangeTokenRequest.Providers.apple:
        user = await exchange_oauth_token(token=req.token, backend=apple_backend)

    if not user:
        raise ValidationError(errors=[], model=ExchangeTokenRequest)

    access, refresh = jwt_backend.for_user(user)
    return TokenPairResponse(access_token=access, refresh_token=refresh)


@router.post("/refresh-token", response_model=TokenPairResponse)
async def refresh_token(req: RefreshTokenRequest):
    """
    given refresh token, get new token pair
    """
    try:
        user = jwt_backend.decode(token=req.refresh_token)
    except BaseException:
        logger.exception("failed to get user from token")
        user = None

    if not user:
        raise ValidationError(errors=[], model=ExchangeTokenRequest)

    access, refresh = jwt_backend.for_user(user)
    return TokenPairResponse(access_token=access, refresh_token=refresh)


async def exchange_oauth_token(token: str, backend: OAuthBackend) -> models.User | None:
    """
    exchange oauth change to retrieve the user
    """
    # TODO: better error handling
    try:
        payload = backend.decode(token=token)
    except BaseException:
        logger.exception("failed to decode token")
        return None

    if not payload:
        return None

    provider_id = payload.get("sub")
    # apple return "bool" instead of bool
    email_verified = payload.get("email_verified") in [True, "true"]

    if not all([provider_id, email_verified]):
        logger.warning(f"invalid provider_id or email is not verified, received {provider_id}, {email_verified}")
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
