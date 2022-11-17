type NumberInput = (value?: number) => void;
export const enterNumber = (callback: NumberInput) => (value: string) => {
  const parsed = parseFloat(value);
  if (isNaN(parsed)) {
    callback();
  }
  callback(parsed);
};

export const numberToStr = (e?: number): string => {
  if (!e) {
    return '';
  }
  if (isNaN(e)) {
    return '';
  }
  return `${e}`;
};
