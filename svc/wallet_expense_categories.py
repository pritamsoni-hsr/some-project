from svc import models


async def create_default_categories(*, user_id: str):
    expense_categories = [
        models.Category(
            user_id=user_id,
            icon="🏡",
            name="Home",
            categories=", ".join(["Rent", "mortgage", "utilities", "insurance"]),
            type="income",
        ),
        models.Category(
            user_id=user_id, icon="🛒", name="Groceries", categories=", ".join(["Groceries"]), type="income"
        ),
        models.Category(
            user_id=user_id,
            icon="🍽",
            name="EatingOut",
            categories=", ".join(["Take-out and restaurants"]),
            type="income",
        ),
        models.Category(
            user_id=user_id,
            icon="👘",
            name="Clothing",
            categories=", ".join(["Essential and unessential clothes"]),
            type="income",
        ),
        models.Category(
            user_id=user_id,
            icon="🚕",
            name="Taxi",
            categories=", ".join(["Car payments", "transit passes"]),
            type="income",
        ),
        models.Category(
            user_id=user_id,
            icon="📲",
            name="Tech",
            categories=", ".join(["Monthly phone and internet bills"]),
            type="income",
        ),
        models.Category(
            user_id=user_id,
            icon="💊",
            name="Health",
            categories=", ".join(["Gym", "classes", "treatments"]),
            type="income",
        ),
        models.Category(
            user_id=user_id,
            icon="🍿",
            name="Entertainment",
            categories=", ".join(["Movies", "shows", "events"]),
            type="income",
        ),
        models.Category(
            user_id=user_id,
            icon="📚",
            name="Education",
            categories=", ".join(["Books", "courses", "seminars"]),
            type="income",
        ),
        models.Category(
            user_id=user_id,
            icon="📆",
            name="Subscriptions",
            categories=", ".join(["non essential services", "monthly bills"]),
            type="income",
        ),
        models.Category(
            user_id=user_id, icon="💍", name="Accessory", categories=", ".join(["Unessential goods"]), type="income"
        ),
        models.Category(user_id=user_id, icon="🍟", name="Snacks", categories=", ".join([]), type="income"),
        models.Category(user_id=user_id, icon="🍵", name="Coffee", categories=", ".join([]), type="income"),
        models.Category(user_id=user_id, icon="🍹", name="Drinks", categories=", ".join([]), type="income"),
        models.Category(user_id=user_id, icon="💄", name="Beauty", categories=", ".join([]), type="income"),
        models.Category(user_id=user_id, icon="🎁", name="Gifts", categories=", ".join([]), type="income"),
        models.Category(user_id=user_id, icon="🚗", name="Car", categories=", ".join([]), type="income"),
        models.Category(user_id=user_id, icon="🎗", name="Charity", categories=", ".join([]), type="income"),
        models.Category(user_id=user_id, icon="🏝", name="Travel", categories=", ".join([]), type="income"),
        models.Category(user_id=user_id, icon="🐶", name="Pets", categories=", ".join([]), type="income"),
        models.Category(
            user_id=user_id, icon="🥲", name="Miscellaneous", categories=", ".join(["Anything else"]), type="income"
        ),
    ]
    await models.Category.bulk_create(objects=expense_categories)
