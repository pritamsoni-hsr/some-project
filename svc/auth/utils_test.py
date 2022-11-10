from datetime import datetime

from freezegun import freeze_time

from . import utils


@freeze_time("2022-10-01")
def test_datetime_epoch():
    now = datetime.now()
    assert utils.datetime_to_epoch(now) == 1664582400


def test_datetime_from_epoch():
    t = utils.datetime_from_epoch(1664582400)
    assert datetime.fromisoformat("2022-10-01") == t
