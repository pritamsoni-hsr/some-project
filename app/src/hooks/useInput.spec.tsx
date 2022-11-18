import { TextInput } from 'react-native';

import { fireEvent, render } from '@testing-library/react-native';

import { arrayToText } from './useInput';

const TagsInput = (props: Parameters<typeof arrayToText>[0]) => {
  const onChangeHandler = arrayToText(props);
  return <TextInput {...onChangeHandler} testID={'tagsInput'} />;
};

it('TagsInput', () => {
  const onChange = jest.fn();
  const tree = render(<TagsInput value={[]} onChange={onChange} />);
  const inputElem = tree.getByTestId('tagsInput');

  // single element with comma
  fireEvent.changeText(inputElem, 'abc,');
  expect(onChange).toHaveBeenCalledWith(['abc', '']);

  // single element
  fireEvent.changeText(inputElem, 'def');
  expect(onChange).toHaveBeenCalledWith(['def']);

  // multiple element
  fireEvent.changeText(inputElem, 'abc,def');
  expect(onChange).toHaveBeenCalledWith(['abc', 'def']);
});
