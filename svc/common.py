from dataclasses import dataclass
from typing import Optional

from pydantic import BaseModel as _BaseModel


@dataclass
class LazyUser:
    id: str


class BaseModel(_BaseModel):
    class Config:
        orm_mode = True
        # title = "body"
        extra = "forbid"


class BaseListModel(BaseModel):
    prev: Optional[str]
    next: Optional[str]
