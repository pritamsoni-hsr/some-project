import { Controller, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';

import { StackScreenProps } from '@react-navigation/stack';
import { Button, Input } from '@ui-kitten/components';

import { Page, Selector, SidePadding, Spacer } from '@app/components';
import { arrayToText } from '@app/hooks';
import { Category, ErrMessage, IncomeType, useCreateCategory } from 'common';

export const CategoryCreate = (props: StackScreenProps<AppRouting, 'CategoryCreate'>) => {
  const formHooks = useForm<Category>({});

  const { mutateAsync: onCreate } = useCreateCategory();
  const handleCreate = (category: Category) => {
    onCreate(
      { category },
      {
        onSuccess() {
          Toast.show({ type: 'success', text1: 'Added wallet' });

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
          name={'type'}
          render={({ field, fieldState }) => (
            <Selector.Enum
              {...field}
              caption={fieldState.error?.message}
              label={'type'}
              options={IncomeType}
              placeholder={IncomeType.Income}
              status={fieldState.error?.message ? 'danger' : 'basic'}
            />
          )}
          rules={{
            required: ErrMessage.required(),
          }}
        />
        <Spacer />
        <Controller
          control={formHooks.control}
          name={'subCategories'}
          render={({ field, fieldState }) => (
            <Input
              {...field}
              {...arrayToText(field)}
              caption={fieldState.error?.message}
              label={'tags'}
              status={fieldState.error?.message ? 'danger' : 'basic'}
              onChangeText={field.onChange}
            />
          )}
        />
      </SidePadding>
      <Spacer direction={'fill'} />
      <SidePadding>
        <Button onPress={formHooks.handleSubmit(handleCreate)}>Save</Button>
      </SidePadding>
      <Spacer size={24} />
    </Page>
  );
};
