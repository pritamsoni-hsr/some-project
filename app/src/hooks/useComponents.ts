import React from 'react';

import BottomSheet from '@gorhom/bottom-sheet';

export const useBottomSheetRef = () => {
  const ref = React.useRef<BottomSheet>(null);
  const open = React.useCallback(() => {
    ref.current?.expand();
  }, []);
  const close = React.useCallback(() => {
    ref.current.close();
  }, []);
  return { ref, open, close };
};
