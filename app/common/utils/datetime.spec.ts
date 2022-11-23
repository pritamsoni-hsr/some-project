import './datetime';

it('test add days', () => {
  const now = new Date(2020, 9, 9, 0, 0, 0, 0);
  const expected = new Date('2020-10-11T18:30:00.000Z');
  const result = now.addDays(2);
  expect(result.toISOString()).toEqual(expected.toISOString());
});

it('test add months', () => {
  const now = new Date(2020, 9, 9, 0, 0, 0, 0);
  const expected = new Date('2020-12-09T18:30:00.000Z');
  const result = now.addMonths(2);
  expect(result.toISOString()).toEqual(expected.toISOString());
});

it('test get day name', () => {
  const now = new Date(2020, 9, 9, 0, 0, 0, 0);
  expect(now.getDayName()).toEqual('Friday');
});

it('test get short day name', () => {
  const now = new Date(2020, 9, 9, 0, 0, 0, 0);
  expect(now.getDayName(true)).toEqual('Fri');
});

it('test get month name', () => {
  const now = new Date(2020, 9, 9, 0, 0, 0, 0);
  expect(now.getMonthName()).toEqual('October');
});

it('test get short month name', () => {
  const now = new Date(2020, 9, 9, 0, 0, 0, 0);
  expect(now.getMonthName(true)).toEqual('Oct');
});
