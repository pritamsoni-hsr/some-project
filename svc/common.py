from dataclasses import dataclass
from typing import Optional

from pydantic import BaseModel as _BaseModel


@dataclass
class LazyUser:
    id: str


class OAuthUser(_BaseModel):
    sub: str
    email_verified: bool
    # provider: str

    def __str__(self) -> str:
        return f"{self.sub} {self.email_verified}"

    @property
    def provider_id(self) -> str:
        return self.sub


class BaseModel(_BaseModel):
    class Config:
        orm_mode = True
        # title = "body"
        extra = "forbid"


class BaseListModel(BaseModel):
    prev: Optional[str]
    next: Optional[str]
