import { useCallback, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

import { StackScreenProps } from '@react-navigation/stack';
import { Button, Input } from '@ui-kitten/components';

import { Icon, Page, Selector, SidePadding, Spacer } from '@app/components';
import {
  Categories,
  CreateWalletRequest,
  Currencies,
  ErrMessage,
  populateError,
  useCreateWallet,
  useDeleteWallet,
  useUpdateWallet,
} from 'common';

// same screen for create and detail wallet, renders according to provided props, id and item.
export const WalletDetail = (props: StackScreenProps<AppRouting, 'WalletDetail'>) => {
  const { id, item } = props.route.params ?? {};

  const formHooks = useForm<CreateWalletRequest>({
    defaultValues: { category: Categories.Expense, currency: 'INR', ...item },
  });

  const { mutate: onCreate } = useCreateWallet();
  const { mutate: onUpdate } = useUpdateWallet();
  const { mutate: onDelete } = useDeleteWallet();

  const handleCreate = (createWalletRequest: CreateWalletRequest) => {
    onCreate(
      { createWalletRequest },
      {
        onError: populateError(formHooks.setError),
        onSettled() {
          Toast.show({ type: 'success', text1: 'Added wallet' });
        },
      },
    );
  };

  const handleUpdate = (createWalletRequest: CreateWalletRequest) => {
    onUpdate(
      { id, createWalletRequest },
      {
        onError: populateError(formHooks.setError),
        onSuccess(response) {
          Toast.show({ type: 'success', text1: 'Updated wallet' });
          props.navigation.setParams({ id: response.id, item: response });
        },
      },
    );
  };

  const handleDelete = useCallback(() => {
    onDelete(
      { id },
      {
        onSuccess() {
          Toast.show({ type: 'success', text1: 'Deleted wallet' });
          props.navigation.canGoBack() && props.navigation.goBack();
        },
      },
    );
  }, [props.navigation, onDelete, id]);

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: item?.name,
      headerRight: param => (id ? <Icon {...param} name={'trash-outline'} onPress={handleDelete} /> : null),
    });
  }, [item?.name, handleDelete, props.navigation, id]);

  return (
    <Page>
      <SidePadding>
        <Controller
          control={formHooks.control}
          name={'icon'}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              caption={fieldState.error?.message}
              label={'icon'}
              status={fieldState.error?.message ? 'danger' : 'basic'}
              onChangeText={field.onChange}
            />
          )}
          rules={{
            required: ErrMessage.required(),
            minLength: ErrMessage.minLength(4),
          }}
        />
        <Spacer />
        <Controller
          control={formHooks.control}
          name={'name'}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              caption={fieldState.error?.message}
              label={'name'}
              status={fieldState.error?.message ? 'danger' : 'basic'}
              onChangeText={field.onChange}
            />
          )}
          rules={{
            required: ErrMessage.required(),
            minLength: ErrMessage.minLength(4),
          }}
        />
        <Spacer />
        <Controller
          control={formHooks.control}
          name={'currency'}
          render={({ field, fieldState }) => (
            <Selector.Enum
              {...field}
              caption={fieldState.error?.message}
              label={'currency'}
              options={Currencies}
              placeholder={Currencies.Inr}
              status={fieldState.error?.message ? 'danger' : 'basic'}
            />
          )}
          rules={{
            required: ErrMessage.required(),
            minLength: ErrMessage.minLength(3),
            maxLength: ErrMessage.maxLength(3),
          }}
        />
        <Spacer />
        <Controller
          control={formHooks.control}
          name={'category'}
          render={({ field, fieldState }) => (
            <Selector.Enum
              {...field}
              caption={fieldState.error?.message}
              label={'category'}
              options={Categories}
              placeholder={Categories.Income}
              status={fieldState.error?.message ? 'danger' : 'basic'}
            />
          )}
        />
        <Spacer />
        {id ? (
          <Button onPress={formHooks.handleSubmit(handleUpdate)}>Update</Button>
        ) : (
          <Button onPress={formHooks.handleSubmit(handleCreate)}>Save</Button>
        )}
      </SidePadding>
    </Page>
  );
};
