from datetime import datetime

import pytz
from tortoise import fields
from tortoise.manager import Manager
from tortoise.models import Model
from ulid import ULID as ulid

from svc.config import config


def get_ulid():
    uid = ulid.from_timestamp(datetime.now(tz=pytz.timezone(config.TIMEZONE)).timestamp())
    return str(uid).lower()


class AppOrmManager(Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)


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

    async def delete(self):
        self.deleted_at = datetime.now(tz=pytz.timezone(config.TIMEZONE))
        await self.save()
