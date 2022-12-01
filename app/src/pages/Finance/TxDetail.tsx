import React from 'react';
import Toast from 'react-native-toast-message';

import { StackScreenProps } from '@react-navigation/stack';
import { useRecoilValue } from 'recoil';

import { Icon } from '@app/components';
import { CreateTransactionRequest, useCreateTransaction, useDeleteTransaction, useUpdateTransaction } from 'common';

import { TxCreate } from './components/TxCreate';
import { selectedWallet } from './state';

const TxDetail = (props: StackScreenProps<AppRouting, 'TxDetail'>) => {
  const { id, item } = props.route.params ?? {};

  const wallet = useRecoilValue(selectedWallet);
  const { mutateAsync: onCreate } = useCreateTransaction();
  const { mutateAsync: onUpdate } = useUpdateTransaction();

  const handleUpdate = (createTransactionRequest: CreateTransactionRequest, walletId: string) =>
    onUpdate(
      { createTransactionRequest, walletId, id },
      {
        onSuccess() {
          Toast.show({ text1: 'Transaction updated' });
        },
      },
    );

  const handleSubmit = (createTransactionRequest: CreateTransactionRequest, walletId: string) =>
    onCreate(
      { createTransactionRequest, walletId },
      {
        onSuccess() {
          Toast.show({ text1: 'Transaction Added' });
        },
      },
    );

  return <TxCreate tx={item} wallet={wallet} onSubmit={id ? handleUpdate : handleSubmit} />;
};

const RightHeader = (props: StackScreenProps<AppRouting, 'TxDetail'>) => {
  const { id, item } = props.route.params ?? {};
  const { mutateAsync } = useDeleteTransaction();
  if (!id) return null;
  return (
    <Icon
      default
      name={'edit'}
      onPress={() =>
        mutateAsync(
          { id, walletId: item.walletId },
          {
            onSuccess() {
              props.navigation.canGoBack() && props.navigation.goBack();
            },
          },
        )
      }
    />
  );
};

TxDetail.Header = RightHeader;

export { TxDetail };
