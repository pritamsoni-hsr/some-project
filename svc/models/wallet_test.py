from datetime import datetime

import pytest
import pytz
from tortoise.exceptions import ValidationError

from .user import User
from .wallet import ExpenseCategory, Transaction, Wallet


@pytest.mark.anyio
async def test_create_wallet(user: User):
    with pytest.raises(ValidationError):
        # do not allow empty values for name, icon and category
        await Wallet.create(user=user, icon="", name="", category="", currency="")

    await Wallet.create(user=user, icon="💳", name="Credit Card", currency="INR", category="")


@pytest.mark.anyio
async def test_create_expense_category(user: User):
    await ExpenseCategory.create(user=user, icon="", name="", categories="")


@pytest.mark.anyio
async def test_create_transaction(user: User):
    wallet = await Wallet.create(user=user, icon="💳", name="Credit Card", currency="INR", category="")
    tx = await Transaction.create(
        user=user,
        wallet=wallet,
        amount=-12.01,
        currency="INR",
        created_at=datetime.now(),
    )
    assert tx is not None


@pytest.mark.anyio
async def test_create_transaction_with_proper_tz(user: User):
    wallet = await Wallet.create(user=user, icon="💳", name="Credit Card", currency="INR", category="")
    now = datetime.now(tz=pytz.timezone("Asia/Kolkata"))
    tx = await Transaction.create(
        user=user,
        wallet=wallet,
        amount=-12.01,
        currency="INR",
        created_at=now,
    )
    assert tx is not None
    assert tx.created_at == now.astimezone(tz=pytz.timezone("UTC"))
