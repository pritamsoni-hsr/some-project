from tortoise import fields
from tortoise.validators import MinLengthValidator

from .common import AppOrmManager, BaseOrm


class ExpenseCategory(BaseOrm):
    user = fields.ForeignKeyField(model_name="models.User")
    icon = fields.TextField()
    name = fields.TextField()
    categories = fields.TextField()

    class Meta:
        manager = AppOrmManager()


class Wallet(BaseOrm):
    user = fields.ForeignKeyField(model_name="models.User")
    icon = fields.TextField(validators=[MinLengthValidator(1)])
    name = fields.TextField(validators=[MinLengthValidator(2)])
    currency = fields.CharField(max_length=3, validators=[MinLengthValidator(3)])
    category = fields.TextField()

    class Meta:
        manager = AppOrmManager()


class Transaction(BaseOrm):
    user = fields.ForeignKeyField(model_name="models.User")
    wallet = fields.ForeignKeyField(model_name="models.Wallet")
    amount = fields.FloatField()
    currency = fields.CharField(max_length=3, validators=[MinLengthValidator(3)])
    note = fields.TextField(null=True)
    created_at = fields.DatetimeField()

    class Meta:
        table = "tx"
        manager = AppOrmManager()

    @property
    def is_debit(self):
        return self.amount < 0

    def __str__(self) -> str:
        return f'{"-"if self.is_debit else ""}{self.currency} {abs(self.amount)}'
