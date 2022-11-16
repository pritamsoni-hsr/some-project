import 'isomorphic-fetch';

import { getErrorMessage, populateError } from './errors';
import { ResponseError } from './openapi';

const errA = { detail: [{ loc: ['body', 'nested'], msg: 'field required', type: 'value_error.missing' }] };

const errB = {
  detail: [
    { loc: ['body', 'nested', 'id'], msg: 'field required', type: 'value_error.missing' },
    { loc: ['body', 'nested', 'name'], msg: 'field required', type: 'value_error.missing' },
  ],
};

describe('Test Errors', () => {
  it('should format error object correctly', () => {
    const res = new Response();
    res.json = jest.fn().mockReturnValue(errA);

    const err = new ResponseError(res);

    const errObject = getErrorMessage(err);
    expect(errObject).toEqual(errA);
  });

  it('should set error object correctly on object', async () => {
    // error when data is '{"id": "string"}'
    const res = new Response();
    res.json = jest.fn().mockReturnValue(errA);

    const err = new ResponseError(res);

    const setError = jest.fn();
    try {
      await populateError(setError)(err);
    } catch (e) {
      expect(setError).toHaveBeenCalledTimes(1);
      expect(setError).toHaveBeenCalledWith('body.nested', 'field required');
    }
  });

  it('should set error object correctly with nested object', async () => {
    // error when data is '{"id": "string", "nested":{}}'
    const res = new Response();
    res.json = jest.fn().mockReturnValue(errB);

    const err = new ResponseError(res);

    const setError = jest.fn();
    try {
      await populateError(setError)(err);
    } catch (e) {
      expect(setError).toHaveBeenCalledTimes(2);
      expect(setError).toHaveBeenCalledWith('body.nested.id', 'field required');
      expect(setError).toHaveBeenLastCalledWith('body.nested.name', 'field required');
    }
  });
});
