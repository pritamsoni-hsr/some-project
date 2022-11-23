import logging
from typing import Dict, List

from faker.providers.currency import Provider
from fastapi import APIRouter, Depends

from svc import models
from svc.common import BaseListModel, BaseModel, LazyUser

from .utils import get_user

logger = logging.getLogger(__name__)


class Category(BaseModel):
    id: str
    icon: str
    name: str
    sub_categories: List[str]


class CategoryListResponse(BaseListModel):
    results: List[Category]


router = APIRouter(tags=["wallet-utils"])


def to_category(obj: models.ExpenseCategory) -> Category:
    return Category(
        id=obj.id,
        icon=obj.icon,
        name=obj.name,
        sub_categories=obj.categories.split(", "),
    )


@router.get(
    "/expense-categories",
    response_model=CategoryListResponse,
    response_model_exclude_none=True,
)
async def get_categories(user: LazyUser = Depends(get_user)):
    return CategoryListResponse(
        results=[to_category(obj) for obj in await models.ExpenseCategory.filter(user_id=user.id)]
    )


class TagsListResponse(BaseListModel):
    results: List[str]


@router.get(
    "/tags",
    response_model=TagsListResponse,
    response_model_exclude_none=True,
)
async def get_user_tags(query: str = "", user: LazyUser = Depends(get_user)):
    """
    return all tags a user has used in past.
    This is useful for autocompletion.
    """
    user_tags = set()

    txs = await models.Transaction.filter(user_id=user.id).limit(500).values("more")
    for tx in txs:
        if tx.get("more") and tx.get("more").get("tags"):
            user_tags.update(tx["more"]["tags"])

    # max size of this set can be 2500
    user_tags = sorted(user_tags)
    return TagsListResponse(results=user_tags)


class Currency(BaseModel):
    code: str
    name: str
    symbol: str | None


@router.get("/currencies", response_model=Dict[str, Currency])
async def get_currencies():
    return {code: Currency(code=code, name=name, symbol=get_symbol(code)) for code, name in Provider.currencies}


def get_symbol(code: str) -> str:
    return Provider.currency_symbols.get(code, code)
