"""
generate random data to use with the app.
"""
from datetime import datetime
from typing import List

from faker import Faker
from tortoise import BaseDBAsyncClient, Tortoise, connections, run_async

from svc import wallet_messages
from svc.auth import api
from svc.config import config
from svc.models.common import get_ulid
from svc.models.user import User
from svc.models.wallet import Transaction, Wallet

faker_proxy = Faker()


async def _generate_data():
    import random

    await Tortoise.init(
        db_url=config.DATABASE_CONN,
        modules={"models": ["svc.models"]},
    )
    await Tortoise.generate_schemas(safe=True)

    conn: BaseDBAsyncClient = connections.get("default")

    wallets: List[Wallet] = []
    for i in range(100):
        currency = faker_proxy.currency_code()
        await api.create_user(provider="shell", provider_id=get_ulid())
        u = random.choice(await User.all())

        w = await Wallet.create(
            using_db=conn,
            user=u,
            name=faker_proxy.last_name(),
            icon="🏡",
            currency=currency,
            category=random.choice([i.value for i in wallet_messages.CreateWalletRequest.Categories]),
        )
        wallets.append(w)
        w = random.choice(wallets)
        tags = ["dine-out", "coffee", "date-night", "regretting", "why???", "dividend", "transfer", "travel"]
        t = await Transaction.create(
            user=u,
            wallet=w,
            amount=float("{0:.2f}".format(random.choice([-10, 10]) * random.random())),
            currency=currency,
            note=faker_proxy.text(),
            created_at=datetime.fromordinal(faker_proxy.date_this_year().toordinal()),
            more=wallet_messages.TransactionMoreInfo(tags=random.choices(tags, k=3)).dict(exclude_none=True),
        )
        print(u, w, t)


def generate_data():
    run_async(_generate_data())
