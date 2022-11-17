import { useEffect, useState } from 'react';

import * as Font from 'expo-font';

const fonts = {
  'lobster-regular': require('../../assets/fonts/Lobster_Two/LobsterTwo-Regular.ttf'),
  'lobster-bold': require('../../assets/fonts/Lobster_Two/LobsterTwo-Bold.ttf'),
  'lobster-italic': require('../../assets/fonts/Lobster_Two/LobsterTwo-Italic.ttf'),
};
const loadFonts = async () => {
  try {
    await Font.loadAsync(fonts);
  } catch (e) {
    // TODO: log to sentry
    console.warn(e);
  }
};

const useCachedResources = () => {
  const [hasFontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    loadFonts().finally(() => setFontsLoaded(true));
  }, []);

  return hasFontsLoaded;
};

/**
 * @description hook to ensure everything is loaded before the first screen loads.
 * it includes fonts, state hydration, disk credentials, refreshing jwt if required.
 */
export const useAppState = () => {
  const hasFontsLoaded = useCachedResources();
  return { isAppReady: hasFontsLoaded };
};
