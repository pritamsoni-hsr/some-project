from fastapi import status
from fastapi.exceptions import HTTPException


class UnauthorizedError(HTTPException):
    def __init__(self) -> None:
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized", headers={})


class UnauthenticatedError(HTTPException):
    def __init__(self) -> None:
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail="Not authenticated", headers={})
