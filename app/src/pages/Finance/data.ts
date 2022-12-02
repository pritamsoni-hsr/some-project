import { Category, IncomeType } from 'common';

// TODO: potentially use this as initial data of query hook
export const SpendCategories: Category[] = [
  // ids are first 10 char of md5 hash of lowercase name
  {
    id: '99fd50d992',
    icon: '🏡',
    type: IncomeType.Expense,
    name: 'Housing',
    subCategories: ['Rent', 'mortgage', 'utilities', 'insurance'],
  },
  { id: '62506be34d', icon: '🛒', type: IncomeType.Expense, name: 'Groceries', subCategories: ['Groceries'] },
  {
    id: '786d1e3c34',
    icon: '🍽',
    type: IncomeType.Expense,
    name: 'Eating out',
    subCategories: ['Take-out and restaurants'],
  },
  {
    id: '50cf199129',
    icon: '👘',
    type: IncomeType.Expense,
    name: 'Clothing',
    subCategories: ['Essential and unessential clothes'],
  },
  {
    id: '4d70921065',
    icon: '🚕',
    type: IncomeType.Expense,
    name: 'Taxi',
    subCategories: ['Car payments', 'transit passes'],
  },
  {
    id: '010b6fcd93',
    icon: '📲',
    type: IncomeType.Expense,
    name: 'Tech',
    subCategories: ['Monthly phone and internet bills'],
  },
  {
    id: '555bf8344c',
    icon: '💊',
    type: IncomeType.Expense,
    name: 'Health',
    subCategories: ['Gym', 'classes', 'treatments'],
  },
  {
    id: 'f375dbeedc',
    icon: '🍿',
    type: IncomeType.Expense,
    name: 'Entertainment',
    subCategories: ['Movies', 'shows', 'events'],
  },
  {
    id: '9fa1b63c91',
    icon: '📚',
    type: IncomeType.Expense,
    name: 'Education',
    subCategories: ['Books', 'courses', 'seminars'],
  },
  {
    id: 'b48b13e73a',
    icon: '📆',
    type: IncomeType.Expense,
    name: 'Subscriptions',
    subCategories: ['non essential services', 'monthly bills'],
  },
  { id: 'b2fe440cb7', icon: '💍', type: IncomeType.Expense, name: 'Accessory', subCategories: [] },
  { id: '8119fbbffa', icon: '🍟', type: IncomeType.Expense, name: 'snacks', subCategories: [] },
  { id: '24eb05d183', icon: '🍟', type: IncomeType.Expense, name: 'coffee', subCategories: [] },
  { id: 'b771356267', icon: '🍹', type: IncomeType.Expense, name: 'drinks', subCategories: [] },
  { id: 'bd273e238d', icon: '💄', type: IncomeType.Expense, name: 'beauty', subCategories: [] },
  { id: 'b4e6d54e33', icon: '🎁', type: IncomeType.Expense, name: 'gifts', subCategories: [] },
  { id: 'e6d9650259', icon: '🚗', type: IncomeType.Expense, name: 'car', subCategories: [] },
  { id: '7f90df6477', icon: '🎗', type: IncomeType.Expense, name: 'charity', subCategories: [] },
  { id: '69266c67e7', icon: '🏝', type: IncomeType.Expense, name: 'travel', subCategories: [] },
  { id: 'd0d64110d9', icon: '🐶', type: IncomeType.Expense, name: 'pets', subCategories: [] },
  { id: 'bc957e26ff', icon: '🥲', type: IncomeType.Expense, name: 'miscellaneous', subCategories: ['Anything else'] },
  //
  { id: '28aa838315', icon: '🤑', type: IncomeType.Income, name: 'Salary', subCategories: [] },
  { id: 'a37c4e010f', icon: '🤑', type: IncomeType.Income, name: 'Pension', subCategories: [] },
  { id: '7680edae4d', icon: '🤑', type: IncomeType.Income, name: 'Interest', subCategories: [] },
  { id: '6df497b4bf', icon: '🤑', type: IncomeType.Income, name: 'Dividend', subCategories: [] },
  { id: '7301c0af5f', icon: '🤑', type: IncomeType.Income, name: 'Rental Income', subCategories: [] },
  { id: 'f5d7e2532c', icon: '🤑', type: IncomeType.Income, name: 'Business Income', subCategories: [] },
  { id: '27ade1b64f', icon: '🤑', type: IncomeType.Income, name: 'Professional Income', subCategories: [] },
];

export const getIcon = (e: string) => {
  // TODO add a default icon
  return SpendCategories.find(u => u.id === e)?.icon ?? 'N/A';
};

export const categoryName = (e: string) => {
  return SpendCategories.find(u => u.id === e)?.name ?? '---';
};
