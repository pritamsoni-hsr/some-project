export enum IncomeType {
  Income = 'income',
  Expense = 'expense',
  Transfer = 'transfer',
}

type ExpenseCategory = {
  id: string;
  icon: string;
  name: string;
  type: IncomeType;
  categories?: string[];
};

export const SpendCategories: ExpenseCategory[] = [
  { id: '99fd50d992', icon: '🏡', type: IncomeType.Expense, name: 'Housing' },
  { id: '62506be34d', icon: '🛒', type: IncomeType.Expense, name: 'Groceries' },
  { id: '786d1e3c34', icon: '🍽', type: IncomeType.Expense, name: 'Eating out' },
  { id: '50cf199129', icon: '👘', type: IncomeType.Expense, name: 'Clothing' },
  { id: '4d70921065', icon: '🚕', type: IncomeType.Expense, name: 'Taxi' },
  { id: '010b6fcd93', icon: '📲', type: IncomeType.Expense, name: 'Tech' },
  { id: '555bf8344c', icon: '💊', type: IncomeType.Expense, name: 'Health' },
  { id: 'f375dbeedc', icon: '🍿', type: IncomeType.Expense, name: 'Entertainment' },
  { id: '9fa1b63c91', icon: '📚', type: IncomeType.Expense, name: 'Education' },
  { id: 'b48b13e73a', icon: '📆', type: IncomeType.Expense, name: 'Subscriptions' },
  { id: 'b2fe440cb7', icon: '💍', type: IncomeType.Expense, name: 'Accessory' },
  { id: '8119fbbffa', icon: '🍟', type: IncomeType.Expense, name: 'snacks' },
  { id: '24eb05d183', icon: '🍟', type: IncomeType.Expense, name: 'coffee' },
  { id: 'b771356267', icon: '🍹', type: IncomeType.Expense, name: 'drinks' },
  { id: 'bd273e238d', icon: '💄', type: IncomeType.Expense, name: 'beauty' },
  { id: 'b4e6d54e33', icon: '🎁', type: IncomeType.Expense, name: 'gifts' },
  { id: 'e6d9650259', icon: '🚗', type: IncomeType.Expense, name: 'car' },
  { id: '7f90df6477', icon: '🎗', type: IncomeType.Expense, name: 'charity' },
  { id: '69266c67e7', icon: '🏝', type: IncomeType.Expense, name: 'travel' },
  { id: 'd0d64110d9', icon: '🐶', type: IncomeType.Expense, name: 'pets' },
  { id: 'bc957e26ff', icon: '🥲', type: IncomeType.Expense, name: 'miscellaneous' },
  //
  { id: '28aa838315', icon: '🤑', type: IncomeType.Income, name: 'Salary' },
  { id: 'a37c4e010f', icon: '🤑', type: IncomeType.Income, name: 'Pension' },
  { id: '7680edae4d', icon: '🤑', type: IncomeType.Income, name: 'Interest' },
  { id: '6df497b4bf', icon: '🤑', type: IncomeType.Income, name: 'Dividend' },
  { id: '7301c0af5f', icon: '🤑', type: IncomeType.Income, name: 'Rental Income' },
  { id: 'f5d7e2532c', icon: '🤑', type: IncomeType.Income, name: 'Business Income' },
  { id: '27ade1b64f', icon: '🤑', type: IncomeType.Income, name: 'Professional Income' },
];

export const getIcon = (e: string) => {
  // TODO add a default icon
  return SpendCategories.find(u => u.id === e)?.icon ?? 'N/A';
};

export const categoryName = (e: string) => {
  return SpendCategories.find(u => u.id === e)?.name ?? '---';
};
