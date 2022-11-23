from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import Field

from svc.common import BaseListModel, BaseModel


class Categories(Enum):
    income = "income"
    expense = "expense"
    savings = "savings"
    investment = "investment"


class Currencies(Enum):
    # TODO add additional currencies
    INR = "INR"
    USD = "USD"
    GBP = "GBP"
    EUR = "EUR"


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


class TransactionResponse(BaseModel):
    id: str
    note: str
    amount: float = Field()
    currency: Currencies | None = Field(
        default=Currencies.INR,
        title="3 digit currency code",
    )
    more: TransactionMoreInfo
    category: str
    is_debit: str
    wallet_id: str
    created_at: Optional[datetime]


class ListTransactionResponse(BaseListModel):
    results: List[TransactionResponse]
