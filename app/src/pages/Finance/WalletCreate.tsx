import { Controller, useForm } from 'react-hook-form';
import { Keyboard } from 'react-native';
import Toast from 'react-native-toast-message';

import { StackScreenProps } from '@react-navigation/stack';
import { Button, Input } from '@ui-kitten/components';

import { Page, Selector, SidePadding, Spacer } from '@app/components';
import { Categories, CreateWalletRequest, Currencies, ErrMessage, populateError, useCreateWallet } from 'common';

export const WalletCreate = (props: StackScreenProps<AppRouting, 'WalletCreate'>) => {
  const formHooks = useForm<CreateWalletRequest>({
    defaultValues: { category: Categories.Expense, currency: 'INR' },
  });

  const { mutate: onCreate } = useCreateWallet();

  const handleCreate = (createWalletRequest: CreateWalletRequest) => {
    onCreate(
      { createWalletRequest },
      {
        onError: populateError(formHooks.setError),
        onSuccess() {
          Toast.show({ type: 'success', text1: 'Added wallet' });

          Keyboard.dismiss();
          formHooks.reset();
          props.navigation.canGoBack() && props.navigation.goBack();
        },
      },
    );
  };

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
            minLength: ErrMessage.minLength(1),
            maxLength: ErrMessage.maxLength(4),
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
            minLength: ErrMessage.minLength(2),
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
        <Button onPress={formHooks.handleSubmit(handleCreate)}>Save</Button>
      </SidePadding>
    </Page>
  );
};
