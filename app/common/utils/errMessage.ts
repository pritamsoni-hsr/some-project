import { Message, ValidationRule } from 'react-hook-form';

export const required = (label = 'This'): Message | ValidationRule<boolean> => ({
  value: true,
  message: `${label} is required`,
});

export const minLength = (min: number, label = 'This'): ValidationRule<number> => ({
  value: min,
  message: `${label} should be at least ${min} characters long`,
});

export const maxLength = (max: number, label = 'This'): ValidationRule<number> => ({
  value: max,
  message: `${label} can be at most ${max} characters long`,
});

export const pattern = (value: RegExp, message = 'Invalid pattern'): ValidationRule<RegExp> => ({
  value,
  message,
});
