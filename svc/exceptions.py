from fastapi.exceptions import HTTPException as BaseHTTPException


class UnauthorizedError(BaseHTTPException):
    def __init__(self) -> None:
        super().__init__(status_code=401, detail="Not authorized", headers={})


class UnauthenticatedError(BaseHTTPException):
    def __init__(self) -> None:
        super().__init__(status_code=403, detail="Not authenticated", headers={})
