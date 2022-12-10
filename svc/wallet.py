from typing import Optional

from fastapi import APIRouter, Depends, Response

from svc import models
from svc.common import LazyUser
from svc.exceptions import UnauthorizedError
from svc.utils import get_user

from .wallet_category import get_symbol
from .wallet_messages import (
    CreateTransactionRequest,
    CreateWalletRequest,
    ListTransactionResponse,
    ListWalletResponse,
    TransactionResponse,
    WalletResponse,
)

router = APIRouter(tags=["wallet"])


def to_wallet(obj: models.Wallet) -> WalletResponse:
    return WalletResponse(
        id=obj.id,
        icon=obj.icon,
        name=obj.name,
        currency=obj.currency,
        category=obj.category or "income",
        created_at=obj.created_at,
        currency_symbol=get_symbol(obj.currency),
        value=0,
    )


@router.get("/", response_model=ListWalletResponse, response_model_exclude_none=True)
async def get_wallets(cursor: Optional[str] = None, user: LazyUser = Depends(get_user)):
    return ListWalletResponse(
        results=[to_wallet(obj) for obj in await models.Wallet.filter(user_id=user.id)],
    )


@router.post("/", response_model=WalletResponse)
async def create_wallet(req: CreateWalletRequest, user: LazyUser = Depends(get_user)):
    obj = models.Wallet(
        user_id=user.id,
        icon=req.icon,
        name=req.name,
        currency=req.currency.value,
        category=req.category.value,
    )
    await obj.save()
    return to_wallet(obj)


@router.get("/{id}", response_model=WalletResponse)
async def get_wallet(id: str, user: LazyUser = Depends(get_user)):
    obj = await models.Wallet.get(id=id)

    if obj.user_id != user.id:
        raise UnauthorizedError()
    return to_wallet(obj)


@router.put("/{id}", response_model=WalletResponse)
async def update_wallet(id: str, req: CreateWalletRequest, user: LazyUser = Depends(get_user)):
    obj = await models.Wallet.get(id=id)
    if obj.user_id != user.id:
        raise UnauthorizedError()
    if req.icon:
        obj.icon = req.icon
    if req.name:
        obj.name = req.name
    if req.currency:
        obj.currency = req.currency.value
    if req.category:
        obj.category = req.category.value
    await obj.save()
    return to_wallet(obj)


@router.delete("/{id}", response_model=None)
async def delete_wallet(id: str, user: LazyUser = Depends(get_user)):
    obj = await models.Wallet.get(id=id)
    if obj.user_id != user.id:
        raise UnauthorizedError()
    await obj.delete()
    return Response(status_code=204)


##########################
#      Transactions      #
##########################


def to_transaction(obj: models.Transaction) -> TransactionResponse:
    return TransactionResponse(
        id=obj.id,
        note=obj.note,
        amount=obj.amount,
        currency=obj.currency,
        currency_symbol=get_symbol(obj.currency),
        created_at=obj.created_at,
        is_debit=obj.is_debit,
        wallet_id=obj.wallet_id,
        category=obj.category or "",
        **(obj.more or {}),
    )


@router.get(
    "/{wallet_id}/transactions",
    response_model=ListTransactionResponse,
    response_model_exclude_none=True,
)
async def get_transactions(wallet_id: str, cursor: str | None = None, user: LazyUser = Depends(get_user)):
    queryset = models.Transaction.filter(user_id=user.id)
    if wallet_id != "all":
        queryset.filter(wallet_id=wallet_id)

    return ListTransactionResponse(
        results=[to_transaction(obj) for obj in await queryset],
    )


@router.post("/{wallet_id}/transactions", response_model=TransactionResponse)
async def create_transaction(
    wallet_id: str,
    req: CreateTransactionRequest,
    user: LazyUser = Depends(get_user),
):
    more = {}
    transfer_to = req.transfer_to
    if transfer_to:
        more.update(dict(transfer_to=transfer_to.dict()))
    tags = req.tags
    if tags:
        more.update(dict(tags=tags))

    obj = models.Transaction(
        note=req.note,
        amount=req.amount,
        currency=req.currency.value,
        wallet_id=wallet_id,
        user_id=user.id,
        created_at=req.created_at,
        category=req.category,
        more=more,
    )
    await obj.save()

    return to_transaction(obj)


@router.get("/{wallet_id}/transactions/{id}", response_model=TransactionResponse)
async def get_transaction(wallet_id: str, id: str, user: LazyUser = Depends(get_user)):
    obj = await models.Transaction.get(id=id, wallet_id=wallet_id)
    if obj.user_id != user.id:
        raise UnauthorizedError()
    return to_transaction(obj)


@router.put("/{wallet_id}/transactions/{id}", response_model=TransactionResponse)
async def update_transaction(
    wallet_id: str, id: str, req: CreateTransactionRequest, user: LazyUser = Depends(get_user)
):
    obj = await models.Transaction.get(id=id, wallet_id=wallet_id)
    if obj.user_id != user.id:
        raise UnauthorizedError()
    if req.note:
        obj.note = req.note
    if req.amount:
        obj.amount = req.amount
    if req.currency:
        obj.currency = req.currency.value
    if req.category:
        obj.category = req.category

    await obj.save()

    return to_transaction(obj)


@router.delete("/{wallet_id}/transactions/{id}", response_model=None)
async def delete_transaction(wallet_id: str, id: str, user: LazyUser = Depends(get_user)):
    obj = await models.Transaction.get(id=id, wallet_id=wallet_id)
    if obj.user_id != user.id:
        raise UnauthorizedError()
    await obj.delete()
    return Response(status_code=204)
