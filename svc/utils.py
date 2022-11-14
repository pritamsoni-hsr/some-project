from logging import getLogger

from fastapi import Header, exceptions
from fastapi.security.utils import get_authorization_scheme_param

from svc.auth.backend import jwt_backend

from .common import LazyUser

logger = getLogger(__name__)


def get_user(authorization: str = Header(alias="Authorization")) -> LazyUser:
    scheme, token = get_authorization_scheme_param(authorization)
    try:
        user = jwt_backend.get_user(token)
        if user:
            return user
    except BaseException:
        logger.exception("failed to get user from token")
    raise exceptions.HTTPException(status_code=403, detail="token is invalid")
