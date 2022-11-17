import { enterNumber, numberToStr } from './numbers';

describe('utils/numbers', () => {
  it('render empty string when undefined', () => {
    expect(numberToStr()).toEqual('');
  });
  it('convert number to string', () => {
    expect(numberToStr(12)).toEqual('12');
  });
  it('convert NaN to empty string', () => {
    expect(numberToStr(NaN)).toEqual('');
  });

  it('callback handler should return number for valid string', () => {
    const cb = jest.fn();
    enterNumber(cb)('12');
    expect(cb).toBeCalledWith(12);
  });
  it('callback handler should return null for invalid string', () => {
    const cb = jest.fn();
    enterNumber(cb)('abc2');
    expect(cb).toBeCalledWith();
  });
});
