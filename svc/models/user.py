from typing import Type

from tortoise import fields

from .common import AppOrmManager, BaseOrm


class User(BaseOrm):
    username = fields.TextField(null=True)
    oauth: Type["UserOAuthConnections"]

    class Meta:
        manager = AppOrmManager()


class UserOAuthConnections(BaseOrm):
    user = fields.ForeignKeyField("models.User", related_name="oauth")
    provider = fields.TextField()

    @property
    def provider_id(self) -> str:
        return self.id

    @provider_id.setter
    def provider_id(self, value: str):
        self.id = value

    class Meta:
        table = "user_oauth_connection"
        manager = AppOrmManager()
