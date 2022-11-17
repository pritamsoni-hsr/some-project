import { useCallback, useState } from 'react';

export const useModal = (initial = false) => {
  const [visible, setVisible] = useState(initial);

  return {
    visible,
    openModal: useCallback(() => setVisible(true), []),
    onRequestClose: useCallback(() => setVisible(false), []),
    toggle: useCallback(x => setVisible(!x), []),

    open: visible,
    closeModal: useCallback(() => setVisible(true), []),
  };
};
