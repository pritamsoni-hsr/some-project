from unittest.mock import MagicMock, patch

from svc import models


@patch("svc.models.get_ulid")
def test_ulid(mocked: MagicMock):
    mocked.return_value = "random"
    assert "random" == models.get_ulid()
