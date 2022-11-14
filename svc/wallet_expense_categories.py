from svc import models


async def create_default_categories(*, user_id: str):
    expense_categories = [
        models.ExpenseCategory(
            user_id=user_id,
            icon="🏡",
            name="Home",
            categories=", ".join(["Rent", "mortgage", "utilities", "insurance"]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="🛒",
            name="Groceries",
            categories=", ".join(["Groceries"]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="🍽",
            name="EatingOut",
            categories=", ".join(["Take-out and restaurants"]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="👘",
            name="Clothing",
            categories=", ".join(["Essential and unessential clothes"]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="🚕",
            name="Taxi",
            categories=", ".join(["Car payments", "transit passes"]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="📲",
            name="Tech",
            categories=", ".join(["Monthly phone and internet bills"]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="💊",
            name="Health",
            categories=", ".join(["Gym", "classes", "treatments"]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="🍿",
            name="Entertainment",
            categories=", ".join(["Movies", "shows", "events"]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="📚",
            name="Education",
            categories=", ".join(["Books", "courses", "seminars"]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="📆",
            name="Subscriptions",
            categories=", ".join(["non essential services", "monthly bills"]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="💍",
            name="Accessory",
            categories=", ".join(["Unessential goods"]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="🍟",
            name="Snacks",
            categories=", ".join([]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="🍵",
            name="Coffee",
            categories=", ".join([]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="🍹",
            name="Drinks",
            categories=", ".join([]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="💄",
            name="Beauty",
            categories=", ".join([]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="🎁",
            name="Gifts",
            categories=", ".join([]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="🚗",
            name="Car",
            categories=", ".join([]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="🎗",
            name="Charity",
            categories=", ".join([]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="🏝",
            name="Travel",
            categories=", ".join([]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="🐶",
            name="Pets",
            categories=", ".join([]),
        ),
        models.ExpenseCategory(
            user_id=user_id,
            icon="🥲",
            name="Miscellaneous",
            categories=", ".join(["Anything else"]),
        ),
    ]
    await models.ExpenseCategory.bulk_create(objects=expense_categories)
