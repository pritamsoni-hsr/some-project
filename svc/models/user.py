from tortoise import fields

from .common import BaseOrm


class User(BaseOrm):
    username = fields.TextField(null=True)


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
