from datetime import datetime
from enum import Enum, StrEnum
from typing import List, Optional

from faker.providers.currency import Provider
from pydantic import Field

from svc.common import BaseListModel, BaseModel


class Categories(str, Enum):
    income = "income"
    expense = "expense"
    savings = "savings"
    investment = "investment"


Currencies = StrEnum("Currencies", [(code, code) for code, _ in Provider.currencies])


class Currency(BaseModel):
    name: str | None
    symbol: str | None
    code: Currencies | None = Field(
        default=Currencies.INR,
        title="3 digit currency code",
    )


class CreateWalletRequest(BaseModel):
    Categories = Categories
    icon: str = Field(max_length=4)
    name: str
    currency: Currencies | None = Field(
        default=Currencies.INR,
        title="3 digit currency code",
    )
    category: Categories | None = Categories.expense


class WalletResponse(CreateWalletRequest):
    id: str
    created_at: Optional[datetime]
    currency_symbol: str | None
    value: float = Field(description="total amount in the wallet")


class ListWalletResponse(BaseListModel):
    results: List[WalletResponse]


class TransferTo(BaseModel):
    walletId: str | None
    currency: Currency | None


class CreateTransactionRequest(BaseModel):
    note: str
    amount: float
    category: str
    currency: Currencies | None = Field(
        default=Currencies.INR,
        title="3 digit currency code",
    )
    created_at: datetime
    tags: List[str] | None
    transfer_to: TransferTo | None


class TransactionResponse(CreateTransactionRequest):
    id: str | None
    currency_symbol: str | None
    category: str | None
    is_debit: bool | None
    wallet_id: str | None


class ListTransactionResponse(BaseListModel):
    results: List[TransactionResponse]
