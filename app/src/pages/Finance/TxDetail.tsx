import React from 'react';

import { StackScreenProps } from '@react-navigation/stack';

import { Icon } from '@app/components';
import { TransactionResponse, useCreateTransaction, useDeleteTransaction, useUpdateTransaction } from 'common';

import { TransactionCreateOne } from './components/TransactionCreateOne';

const TxDetail = (props: StackScreenProps<AppRouting, 'TxDetail'>) => {
  const { id, item } = props.route.params ?? {};

  const { mutateAsync: onCreate } = useCreateTransaction();
  const { mutateAsync: onUpdate } = useUpdateTransaction();

  const handleUpdate = (createTransactionRequest: TransactionResponse, walletId: string) =>
    onUpdate({ createTransactionRequest, walletId, id });

  const handleSubmit = (createTransactionRequest: TransactionResponse, walletId: string) =>
    onCreate({ createTransactionRequest, walletId });

  return <TransactionCreateOne tx={item} onSubmit={id ? handleUpdate : handleSubmit} />;
};

const RightHeader = (props: StackScreenProps<AppRouting, 'TxDetail'>) => {
  const { id, item } = props.route.params ?? {};
  const { mutate } = useDeleteTransaction();
  if (!id) return null;
  return <Icon default name={'edit'} onPress={() => mutate({ id, walletId: item.walletId })} />;
};

TxDetail.Header = RightHeader;

export { TxDetail };
