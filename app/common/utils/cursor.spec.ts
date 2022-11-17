import { getCursor } from './cursor';

describe('utils/common', () => {
  it('test get cursor', () => {
    expect(getCursor('http://abc.xyz?cursor=123&name=pritam')).toEqual('123');
  });
  it('test can get cursor', () => {
    expect(
      getCursor('http://192.168.18.32:8001/transactions/?cursor=bz0zJnA9MjAyMi0wMy0zMSswMCUzQTAwJTNBMDAlMkIwMCUzQTAw'),
    ).toEqual('bz0zJnA9MjAyMi0wMy0zMSswMCUzQTAwJTNBMDAlMkIwMCUzQTAw');
  });
  it('test get cursor invalid url', () => {
    expect(getCursor('cursor=123&name=pritam')).toEqual('123');
  });
});
