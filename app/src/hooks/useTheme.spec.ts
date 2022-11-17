import { Dimensions } from 'react-native';

import { renderHook } from '@testing-library/react-hooks';

import { useTheme } from './useTheme';

describe('Test responsive theme', () => {
  it('tiny phones', () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 120, height: 120, fontScale: 1, scale: 1 });

    const { result } = renderHook(() => useTheme());
    expect(result.current.spacing).toEqual({ roundness: 8, gap: 20 });
  });

  it('normal phones', () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 400, height: 120, fontScale: 1, scale: 1 });

    const { result } = renderHook(() => useTheme());
    expect(result.current.spacing).toEqual({ roundness: 12, gap: 24 });
  });

  it('huge phones', () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({ width: 500, height: 120, fontScale: 1, scale: 1 });

    const { result } = renderHook(() => useTheme());
    expect(result.current.spacing).toEqual({ roundness: 14, gap: 30 });
  });
});
