from calendar import timegm
from datetime import datetime


def datetime_to_epoch(dt: datetime) -> int:
    return timegm(dt.utctimetuple())


def make_utc(dt: datetime) -> datetime:
    return dt


def aware_utcnow() -> datetime:
    return make_utc(datetime.utcnow())


def datetime_from_epoch(ts: float) -> datetime:
    return make_utc(datetime.utcfromtimestamp(ts))
