import { fireEvent, render } from '@testing-library/react-native';

import { TxCreate } from './TxCreate';

describe('TxCreate', () => {
  it('should match design', () => {
    const onsubmit = jest.fn();
    const elem = render(<TxCreate onSubmit={onsubmit} />);
    expect(elem.toJSON()).toMatchSnapshot();
  });

  it('enter non number should raise error', () => {
    const onsubmit = jest.fn();
    const elem = render(<TxCreate onSubmit={onsubmit} />);
    const inputElem = elem.getByTestId('amountInput');
    fireEvent.changeText(inputElem, '123as');
    expect(inputElem.props).toMatchObject({ status: 'danger', caption: 'Please enter a number' });
  });
});
