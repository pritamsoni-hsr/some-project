import React from 'react';

import * as eva from '@eva-design/eva';
import { QueryClientProvider } from '@tanstack/react-query';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { RecoilRoot } from 'recoil';

import { queryClient } from 'common/query';

export const RecoilWrapper = (props: $Children) => {
  return <RecoilRoot>{props.children}</RecoilRoot>;
};

export const AppProviders = (props: $Children) => {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <IconRegistry icons={EvaIconsPack} />
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>{props.children}</RecoilRoot>
      </QueryClientProvider>
    </ApplicationProvider>
  );
};
