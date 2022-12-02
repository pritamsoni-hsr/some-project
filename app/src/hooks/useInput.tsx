import { useState } from 'react';

export const useInput = <T extends undefined>(initialValue: T) => {
  const [value, onChange] = useState<T>(initialValue);
  return {
    value,
    onChangeText: onChange,
  };
};

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
};

export const arrayToText = (props: Props) => {
  return {
    value: props.value?.join(','),
    onChangeText: (arr: string) => {
      props.onChange(arr.split(','));
    },
  };
};
