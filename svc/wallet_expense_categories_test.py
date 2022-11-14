import pytest

from svc import models

from .auth import api


@pytest.mark.anyio
async def test_create_categories_on_creating_user():
    await api.create_user(provider_id="oauth-id", provider="default")
    assert await models.User.filter().count() == 1
    assert await models.ExpenseCategory.filter().count() == 21
