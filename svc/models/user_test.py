import pytest
from tortoise.exceptions import IntegrityError

from .user import User, UserOAuthConnections


@pytest.mark.anyio
async def test_create_user():
    user = await User.create()
    assert user is not None, "should be able to create user with just user id"


@pytest.mark.anyio
async def test_create_oauth_connection():
    user = await User.create()
    connection = await UserOAuthConnections.create(user=user, id="random", provider="google")
    assert connection.user_id == user.id, "should associate correct user"

    with pytest.raises(IntegrityError):
        # cannot create another connection with same id
        await UserOAuthConnections.create(user=user, id="random", provider="apple")
