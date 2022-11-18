import { HTTPValidationError, ResponseError } from './openapi';

export const getErrorMessage = async (err?: ResponseError) => {
  if (!err) {
    // some unknown error occurred, please report it to us
    return 'invalid_error';
  }

  // handle errors when json is returned
  if (err.response.json) {
    return (await err.response.json()) as HTTPValidationError;
  }

  // render error in string format in all other cases
  return err.toString();
};

export const populateError = (setError: (k: string, v: any) => void) => async (err: ResponseError) => {
  const errResponse: HTTPValidationError = await err.response.json();
  if (!errResponse.detail) Promise.reject(err);

  errResponse.detail.map(e => {
    setError((e.loc as string[]).join('.'), e.msg);
  });

  return Promise.reject(err);
};
