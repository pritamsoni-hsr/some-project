from datetime import datetime

import pytest
from tortoise.exceptions import DoesNotExist

from svc import models, wallet
from svc.common import LazyUser
from svc.exceptions import UnauthorizedError
from svc.wallet_messages import Currencies, Currency, TransferTo


@pytest.mark.anyio
async def test_get_wallets(user: models.User):
    obj = await models.Wallet.create(icon="abc", name="abc", currency="INR", category="income", user_id=user.id)

    user2 = await models.User.create()
    await models.Wallet.create(icon="abc", name="abc", currency="INR", category="income", user_id=user2.id)

    r = await wallet.get_wallets(cursor=None, user=LazyUser(id=user.id))
    assert r.next is None
    assert r.prev is None
    assert r.results == [wallet.to_wallet(obj)]


@pytest.mark.anyio
async def test_create_wallet(user: models.User):
    r = await wallet.create_wallet(
        wallet.CreateWalletRequest(
            icon="abc",
            name="adsf",
            currency="INR",
            category=wallet.CreateWalletRequest.Categories.expense,
        ),
        user=LazyUser(id=user.id),
    )
    assert r.icon == "abc"
    assert r.name == "adsf"
    assert r.currency == Currencies.INR
    assert r.category == wallet.CreateWalletRequest.Categories.expense


@pytest.mark.anyio
async def test_get_wallet(user: models.User):
    obj = models.Wallet(icon="abc", name="abc", currency="INR", category="income", user_id=user.id)
    await obj.save()

    r = await wallet.get_wallet(id=obj.id, user=LazyUser(id=user.id))
    assert r.icon == "abc"
    assert r.name == "abc"
    assert r.currency == Currencies.INR

    with pytest.raises(DoesNotExist):
        await wallet.get_wallet(id="obj.id", user=LazyUser(id=user.id))

    with pytest.raises(UnauthorizedError):
        await wallet.get_wallet(id=obj.id, user=LazyUser(id="user.id"))


@pytest.mark.anyio
async def test_delete_wallet(user: models.User):
    obj = await models.Wallet.create(icon="abc", name="abc", currency="INR", category="income", user_id=user.id)
    r = await wallet.delete_wallet(id=obj.id, user=LazyUser(id=user.id))
    assert r.status_code == 204

    with pytest.raises(DoesNotExist):
        await wallet.get_wallet(id=obj.id, user=LazyUser(id=user.id))


@pytest.mark.anyio
async def test_get_transactions(user: models.User):
    w = await models.Wallet.create(icon="abc", name="abc", currency="INR", category="income", user_id=user.id)
    obj = await models.Transaction.create(
        note="", amount=12, currency=w.currency, wallet=w, user_id=user.id, created_at=datetime.now()
    )

    user2 = await models.User.create()
    await models.Transaction.create(
        note="", amount=12, currency=w.currency, wallet=w, user_id=user2.id, created_at=datetime.now()
    )

    r = await wallet.get_transactions(wallet_id=w.id, cursor=None, user=LazyUser(id=user.id))
    assert r.next is None
    assert r.prev is None
    assert r.results == [wallet.to_transaction(obj)]


@pytest.mark.anyio
async def test_create_transaction(user: models.User):
    obj = await models.Wallet.create(icon="abc", name="abc", currency="INR", category="income", user_id=user.id)

    r = await wallet.create_transaction(
        wallet_id=obj.id,
        req=wallet.CreateTransactionRequest(
            note="some-random-note",
            amount=12.20,
            currency=Currencies.INR,
            created_at=datetime(year=2022, month=10, day=1),
            tags=["abc", "def"],
            category="food",
        ),
        user=LazyUser(id=user.id),
    )
    assert r.note == "some-random-note"
    assert r.amount == 12.20
    assert r.currency == Currencies.INR
    assert r.category == "food"
    assert r.wallet_id == obj.id
    assert r.tags == ["abc", "def"]
    assert r.transfer_to is None


@pytest.mark.anyio
async def test_transfer_tx(user: models.User):
    obj = await models.Wallet.create(icon="abc", name="abc", currency="INR", category="income", user_id=user.id)
    r = await wallet.create_transaction(
        wallet_id=obj.id,
        req=wallet.CreateTransactionRequest(
            note="some-random-note",
            amount=12.20,
            currency=Currencies.INR,
            created_at=datetime(year=2022, month=10, day=1),
            tags=["abc", "def"],
            transfer_to=TransferTo(walletId="abc", currency=Currency(code="USD")),
            category="",
        ),
        user=LazyUser(id=user.id),
    )
    assert r.transfer_to.walletId == "abc"


@pytest.mark.anyio
async def test_get_transaction(user: models.User):
    w = await models.Wallet.create(icon="abc", name="abc", currency="INR", category="income", user_id=user.id)
    obj = await models.Transaction.create(
        note="", amount=-12, currency=w.currency, wallet=w, user_id=user.id, created_at=datetime.now()
    )

    r = await wallet.get_transaction(wallet_id=w.id, id=obj.id, user=LazyUser(id=user.id))
    assert r.amount == -12
    assert r.note == ""
    assert r.currency == Currencies.INR

    with pytest.raises(DoesNotExist):
        await wallet.get_transaction(wallet_id=w.id, id="obj.id", user=LazyUser(id=user.id))

    with pytest.raises(UnauthorizedError):
        await wallet.get_transaction(wallet_id=w.id, id=obj.id, user=LazyUser(id="user.id"))


@pytest.mark.anyio
async def test_delete_transaction(user: models.User):
    w = await models.Wallet.create(icon="abc", name="abc", currency="INR", category="income", user_id=user.id)
    obj = await models.Transaction.create(
        note="", amount=12, currency=w.currency, wallet=w, user_id=user.id, created_at=datetime.now()
    )
    r = await wallet.delete_transaction(wallet_id=w.id, id=obj.id, user=LazyUser(id=user.id))
    assert r.status_code == 204

    with pytest.raises(DoesNotExist):
        await wallet.get_transaction(wallet_id=w.id, id=obj.id, user=LazyUser(id=user.id))
