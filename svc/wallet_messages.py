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


class ListWalletResponse(BaseListModel):
    results: List[WalletResponse]


class TransactionMoreInfo(BaseModel):
    tags: Optional[List[str]]
    transfer_to: Optional[str]


class CreateTransactionRequest(BaseModel):
    note: str
    amount: float
    currency: Currencies | None = Field(
        default=Currencies.INR,
        title="3 digit currency code",
    )
    more: TransactionMoreInfo
    created_at: datetime


class TransactionResponse(CreateTransactionRequest):
    id: str
    currency_symbol: str | None
    category: str
    is_debit: str
    wallet_id: str


class ListTransactionResponse(BaseListModel):
    results: List[TransactionResponse]
