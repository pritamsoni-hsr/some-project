from logging import getLogger
from typing import Optional

from fastapi import Request, exceptions
from fastapi.security.http import HTTPAuthorizationCredentials, HTTPBearer

from svc.auth.backend import jwt_backend
from svc.config import config

from .common import LazyUser

logger = getLogger(__name__)


class UserTokenAuth(HTTPBearer):
    async def __call__(self, request: Request) -> Optional[HTTPAuthorizationCredentials]:
        if config.TEST_USER_ID:
            return LazyUser(id=config.TEST_USER_ID)
        response = await super().__call__(request)
        if not response:
            return response
        token = response.credentials
        try:
            user = jwt_backend.get_user(token)
            if user:
                return user
        except BaseException:
            logger.exception("failed to get user from token")
        raise exceptions.HTTPException(status_code=403, detail="token is invalid")


get_user = UserTokenAuth()
