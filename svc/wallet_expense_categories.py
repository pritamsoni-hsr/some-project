from svc.models import wallet as models


async def create_default_categories(*, user_id: str):
    expense_categories = [
        models.Category(
            user_id=user_id,
            icon="🏡",
            name="Home",
            type=models.IncomeType.Expense,
            categories=", ".join(["Rent", "mortgage", "utilities", "insurance"]),
        ),
        models.Category(
            user_id=user_id,
            icon="🛒",
            name="Groceries",
            type=models.IncomeType.Expense,
            categories=", ".join(["Groceries"]),
        ),
        models.Category(
            user_id=user_id,
            icon="🍽",
            name="EatingOut",
            type=models.IncomeType.Expense,
            categories=", ".join(["Take-out and restaurants"]),
        ),
        models.Category(
            user_id=user_id,
            icon="👘",
            name="Clothing",
            type=models.IncomeType.Expense,
            categories=", ".join(["Essential and unessential clothes"]),
        ),
        models.Category(
            user_id=user_id,
            icon="🚕",
            name="Taxi",
            type=models.IncomeType.Expense,
            categories=", ".join(["Car payments", "transit passes"]),
        ),
        models.Category(
            user_id=user_id,
            icon="📲",
            name="Tech",
            type=models.IncomeType.Expense,
            categories=", ".join(["Monthly phone and internet bills"]),
        ),
        models.Category(
            user_id=user_id,
            icon="💊",
            name="Health",
            type=models.IncomeType.Expense,
            categories=", ".join(["Gym", "classes", "treatments"]),
        ),
        models.Category(
            user_id=user_id,
            icon="🍿",
            name="Entertainment",
            type=models.IncomeType.Expense,
            categories=", ".join(["Movies", "shows", "events"]),
        ),
        models.Category(
            user_id=user_id,
            icon="📚",
            name="Education",
            type=models.IncomeType.Expense,
            categories=", ".join(["Books", "courses", "seminars"]),
        ),
        models.Category(
            user_id=user_id,
            icon="📆",
            name="Subscriptions",
            type=models.IncomeType.Expense,
            categories=", ".join(["non essential services", "monthly bills"]),
        ),
        models.Category(
            user_id=user_id,
            icon="💍",
            name="Accessory",
            type=models.IncomeType.Expense,
            categories=", ".join(["Unessential goods"]),
        ),
        models.Category(
            user_id=user_id,
            icon="🍟",
            name="Snacks",
            type=models.IncomeType.Expense,
            categories=", ".join([]),
        ),
        models.Category(
            user_id=user_id,
            icon="🍵",
            name="Coffee",
            type=models.IncomeType.Expense,
            categories=", ".join([]),
        ),
        models.Category(
            user_id=user_id,
            icon="🍹",
            name="Drinks",
            type=models.IncomeType.Expense,
            categories=", ".join([]),
        ),
        models.Category(
            user_id=user_id,
            icon="💄",
            name="Beauty",
            type=models.IncomeType.Expense,
            categories=", ".join([]),
        ),
        models.Category(
            user_id=user_id,
            icon="🎁",
            name="Gifts",
            type=models.IncomeType.Expense,
            categories=", ".join([]),
        ),
        models.Category(
            user_id=user_id,
            icon="🚗",
            name="Car",
            type=models.IncomeType.Expense,
            categories=", ".join([]),
        ),
        models.Category(
            user_id=user_id,
            icon="🎗",
            name="Charity",
            type=models.IncomeType.Expense,
            categories=", ".join([]),
        ),
        models.Category(
            user_id=user_id,
            icon="🏝",
            name="Travel",
            type=models.IncomeType.Expense,
            categories=", ".join([]),
        ),
        models.Category(
            user_id=user_id,
            icon="🐶",
            name="Pets",
            type=models.IncomeType.Expense,
            categories=", ".join([]),
        ),
        models.Category(
            user_id=user_id,
            icon="🥲",
            name="Miscellaneous",
            type=models.IncomeType.Expense,
            categories=", ".join(["Anything else"]),
        ),
    ]
    await models.Category.bulk_create(objects=expense_categories)
