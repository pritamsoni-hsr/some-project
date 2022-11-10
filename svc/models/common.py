from datetime import datetime
from typing import Optional

import pytz
from tortoise import BaseDBAsyncClient, fields
from tortoise.models import Model
from ulid import ULID as ulid

from svc.config import config


def get_ulid():
    uid = ulid.from_timestamp(datetime.now(tz=pytz.timezone(config.TIMEZONE)).timestamp())
    return str(uid).lower()


class BaseOrm(Model):
    id = fields.CharField(pk=True, max_length=50, default=get_ulid)
    created_at = fields.DatetimeField(auto_now_add=True, editable=False)
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        abstract = True

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}: {self.id}"

    def __str__(self) -> str:
        return self.__repr__()

    @classmethod
    async def delete(cls, using_db: Optional[BaseDBAsyncClient] = None):
        cls.deleted_at = datetime.now(tz=pytz.timezone(config.TIMEZONE))
        await cls.save()
