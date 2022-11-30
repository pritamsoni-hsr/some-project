import { useCallback, useEffect } from 'react';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { Keyboard, ScrollView, StyleSheet } from 'react-native';

import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { Button, Datepicker, Input } from '@ui-kitten/components';
import moment from 'moment';

import { ActivityBar, Error, Grid, Icon, Loader, Row, SidePadding, Spacer, Text, View } from '@app/components';
import { bottomSheetProps } from '@app/defaults';
import { useBottomSheetRef, useTheme } from '@app/hooks';
import {
  Categories,
  CreateTransactionRequest,
  Currencies,
  ErrMessage,
  TransactionResponse,
  WalletResponse,
  populateError,
  useWallets,
} from 'common';

import { DefaultCategoryData, IncomeCategories } from '../data';
import { CardIcon } from './CardIcon';

enum IncomeType {
  Income = 'income',
  Expense = 'expense',
  Transfer = 'transfer',
}

type FormInputs = {
  isDebit: boolean;
  amount: string;
  walletId: string;
  category: string;
  createdAt: Date;
  note: string;

  tags: string[];
  transferTo: string;

  // only for ui
  extra: {
    budget: IncomeType;
    walletCurrencyCode: Currencies;
    walletCurrencySymbol: string;

    transferToCurrencyCode: string;
    transferToCurrencySymbol: string;
  };
};

export const TransactionCreateOne = (props: {
  tx?: TransactionResponse;
  wallet?: WalletResponse;
  onSubmit?: (e: CreateTransactionRequest, walletId: string) => Promise<TransactionResponse>;
}) => {
  const sheetA = useBottomSheetRef();
  const sheetB = useBottomSheetRef();
  const navigation = useNavigation();

  const { colors } = useTheme();
  const backgroundColor = colors.background;

  const formHooks = useForm<FormInputs>({
    defaultValues: responseToForm(props.tx, props.wallet),
  });

  const onSubmit = async (formData: FormInputs) => {
    await props.onSubmit?.({ ...formToRequest(formData) }, formData.walletId).catch(populateError(formHooks.setError));

    Keyboard.dismiss();
    formHooks.reset();
    navigation.canGoBack() && navigation.goBack();
  };

  return (
    <FormProvider {...formHooks}>
      <ScrollView keyboardDismissMode={'on-drag'}>
        <SidePadding>
          <Controller
            control={formHooks.control}
            name={'isDebit'}
            render={({ field }) => (
              <ActivityBar
                options={[
                  { label: 'Expense', value: true },
                  { label: 'Income', value: false },
                ]}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Spacer />
          <AmountInput />
          <Spacer />

          <Controller
            control={formHooks.control}
            name={'note'}
            render={param => (
              <Input
                {...param.field}
                caption={param.fieldState.error?.message}
                clearButtonMode={'always'}
                label={'Note'}
                placeholder={'Add Note'}
                status={param.fieldState.error ? 'danger' : 'info'}
                style={[styles.transparentInput, { borderBottomWidth: 1 }]}
                textStyle={{ marginHorizontal: 0 }}
                onChangeText={param.field.onChange}
              />
            )}
            rules={{
              required: ErrMessage.required(),
            }}
          />
          <Spacer />

          <Controller
            control={formHooks.control}
            name={'tags'}
            render={({ field }) => (
              <Input
                {...field}
                caption={'separate tags with comma'}
                label={'Tags'}
                value={field.value.join(', ')}
                onChangeText={e => field.onChange(e.split(', '))}
              />
            )}
          />
          <Spacer />

          <TransferMoney />
          <Spacer />
          <Controller
            control={formHooks.control}
            name={'createdAt'}
            render={({ field }) => (
              <Datepicker
                autoDismiss
                date={field.value}
                max={new Date()}
                min={moment().add(-3, 'months').toDate()}
                placeholder={'Select date'}
                onSelect={d => {
                  field.onChange(d);
                  field.onBlur();
                }}
              />
            )}
          />

          <Spacer />

          <Row justifyContent={'center'}>
            <Text>abc</Text>
            <Spacer direction={'horizontal'} />
            <Icon name={'arrow-forward'} status={'basic'} />
            <Spacer direction={'horizontal'} />
            <Text>abc</Text>
          </Row>
          <Row justifyContent={'space-between'}>
            <Row>
              <Button size={'small'} style={styles.roundedButton} onPress={sheetA.open}>
                From
              </Button>
              <Spacer direction={'horizontal'} />
              <Button size={'small'} status={'danger'} style={styles.roundedButton} onPress={sheetB.open}>
                On
              </Button>
            </Row>
            <Button
              disabled={formHooks.formState.isSubmitting || !formHooks.formState.isValid}
              size={'small'}
              style={styles.roundedButton}
              onPress={formHooks.handleSubmit(onSubmit)}>
              Save
            </Button>
          </Row>
        </SidePadding>
      </ScrollView>

      <BottomSheet
        ref={sheetA.ref}
        {...bottomSheetProps}
        backgroundStyle={[styles.sheetContainer, { backgroundColor }]}>
        <WalletPicker onClose={sheetA.close} />
      </BottomSheet>

      <BottomSheet
        ref={sheetB.ref}
        {...bottomSheetProps}
        backgroundStyle={[styles.sheetContainer, { backgroundColor }]}>
        <TxCategoryPicker onClose={sheetB.close} />
      </BottomSheet>
    </FormProvider>
  );
};

type CloseHandler = { onClose: () => void };

const WalletPicker = ({ onClose }: CloseHandler) => {
  const response = useWallets();

  const { setValue, watch } = useFormContext<FormInputs>();
  const expenseWallet = watch('walletId');
  const isDebit = watch('isDebit');

  const onPress = useCallback(
    (item: WalletResponse) => {
      setValue('walletId', item.id);
      setValue('extra.walletCurrencyCode', item.currency);
      setValue('extra.walletCurrencySymbol', item.currencySymbol);
      setTimeout(() => onClose(), 200);
    },
    [setValue, onClose],
  );

  const filterIncomeWallets = useCallback((e: WalletResponse) => e.category === Categories.Income, []);

  const renderItem = useCallback(
    (item: WalletResponse) => (
      <CardIcon {...item} key={item.id} selected={item.id === expenseWallet} onPress={onPress} />
    ),
    [expenseWallet, onPress],
  );

  if (response.isLoading) return <Loader />;
  if (response.isError) return <Error />;

  return (
    <BottomSheetScrollView showsVerticalScrollIndicator={false}>
      <Text center>Select Account</Text>
      <Spacer />
      <Grid
        data={isDebit ? response.data.results : response.data.results.filter(filterIncomeWallets)}
        renderItem={renderItem}
      />
    </BottomSheetScrollView>
  );
};

const TxCategoryPicker = ({ onClose }: CloseHandler) => {
  const response = useWallets();

  const { setValue, watch, resetField } = useFormContext<FormInputs>();
  const isDebit = watch('isDebit');

  useEffect(() => {
    if (isDebit) setValue('extra.budget', IncomeType.Expense);
    else setValue('extra.budget', IncomeType.Income);
  }, [isDebit, setValue]);

  const onPress = useCallback(
    (onType: IncomeType) => (value: WalletResponse | TransactionResponse) => {
      switch (onType) {
        case IncomeType.Income:
          setValue('walletId', value.id);
          setValue('category', 'Income');
          setValue('transferTo', undefined);
          setValue('extra.budget', IncomeType.Income);
          break;
        case IncomeType.Expense:
          resetField('walletId');
          setValue('category', value.id);
          setValue('transferTo', undefined);
          setValue('extra.budget', IncomeType.Expense);
          break;
        case IncomeType.Transfer:
          resetField('walletId');
          setValue('category', 'Transfer');
          setValue('transferTo', value.id);
          setValue('extra.budget', IncomeType.Transfer);
          setValue('extra.transferToCurrencyCode', value.currency);
          setValue('extra.transferToCurrencySymbol', value.currencySymbol);
          break;
      }
      setTimeout(() => onClose(), 200);
    },
    [setValue, onClose, resetField],
  );

  const isItemSelected = useCallback(
    (value: string) => {
      switch (watch('extra.budget')) {
        case IncomeType.Income:
          return watch('walletId') === value;
        case IncomeType.Expense:
          return watch('category') === value;
        case IncomeType.Transfer:
          return watch('transferTo') === value;
      }
    },
    [watch],
  );

  const renderItem = useCallback(
    (onType: IncomeType) => (item: typeof DefaultCategoryData[number] | WalletResponse) => {
      return <CardIcon {...item} selected={isItemSelected(item.id)} onPress={onPress(onType)} />;
    },
    [onPress, isItemSelected],
  );

  if (response.isLoading) return <Loader />;
  if (response.isError) return <Error />;

  if (!isDebit)
    return (
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        <Text center>Income</Text>
        <Spacer />
        <Grid data={IncomeCategories} renderItem={renderItem(IncomeType.Income)} />
      </BottomSheetScrollView>
    );

  return (
    <BottomSheetScrollView showsVerticalScrollIndicator={false}>
      <Text center>Expense</Text>
      <Spacer />
      <Grid data={DefaultCategoryData} renderItem={renderItem(IncomeType.Expense)} />

      <Text center>Transfer</Text>
      <Spacer />
      <Grid data={response.data.results} renderItem={renderItem(IncomeType.Transfer)} />
    </BottomSheetScrollView>
  );
};

const TransferMoney = () => {
  const formHooks = useFormContext<FormInputs>();

  const walletCurrency = formHooks.watch('extra.walletCurrencySymbol');
  const transferToCurrency = formHooks.watch('extra.transferToCurrencySymbol');

  if (formHooks.watch('extra.budget') !== IncomeType.Transfer) return null;
  if (walletCurrency === transferToCurrency) return null;

  return (
    <View>
      <Input
        accessoryLeft={() => <Text>{transferToCurrency}</Text>}
        accessoryRight={() => (
          <Row>
            <Text>{walletCurrency}</Text>
            <Icon name={'arrow-forward'} />
            <Text>{transferToCurrency}</Text>
          </Row>
        )}
        keyboardType={'numeric'}
        label={'Amount received'}
        maxLength={9}
        returnKeyType={'done'}
      />

      <Input
        accessoryLeft={() => <Text>{walletCurrency}</Text>}
        keyboardType={'numeric'}
        label={'service charge'}
        maxLength={9}
        returnKeyType={'done'}
      />
    </View>
  );
};

const AmountInput = () => {
  const formHooks = useFormContext<FormInputs>();
  const currencySymbol = formHooks.watch('extra.walletCurrencySymbol');
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>
      <Text size={28}>{currencySymbol}</Text>
      <Controller
        control={formHooks.control}
        name={'amount'}
        render={({ field, fieldState }) => (
          <Input
            autoFocus
            enablesReturnKeyAutomatically
            caption={fieldState.error?.message}
            keyboardType={'numeric'}
            maxLength={9}
            returnKeyType={'done'}
            status={fieldState.error ? 'danger' : 'info'}
            style={{ minWidth: 140, borderWidth: 0, borderBottomWidth: 0.5, backgroundColor: '#0000' }}
            textStyle={{ fontSize: 20, marginHorizontal: 0 }}
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
        rules={{
          required: ErrMessage.required(),
          pattern: ErrMessage.pattern(/^\d+\.?\d*$/),
        }}
      />
    </View>
  );
};

/** given API response convert to desired react hook form initial state */
const responseToForm = (tx: TransactionResponse, wallet?: WalletResponse): FormInputs =>
  tx
    ? {
        isDebit: tx.isDebit,
        amount: `${Math.abs(tx.amount || 0) || ''}`,
        walletId: tx.walletId,
        category: tx.category,
        createdAt: tx.createdAt,
        note: tx.note,
        tags: tx.tags || [],
        transferTo: tx.transferTo?.walletId,
        extra: {
          budget: IncomeType.Expense,
          walletCurrencyCode: tx.currency,
          walletCurrencySymbol: tx.currencySymbol,
          transferToCurrencyCode: tx.transferTo?.currency?.code,
          transferToCurrencySymbol: tx.transferTo?.currency?.symbol,
        },
      }
    : {
        isDebit: true,
        amount: '',
        walletId: wallet?.id,
        category: '',
        createdAt: moment(new Date()).add(-1, 'days').toDate(),
        note: '',
        tags: [],
        transferTo: '',
        extra: {
          budget: IncomeType.Expense,
          walletCurrencyCode: wallet?.currency,
          walletCurrencySymbol: wallet?.currencySymbol,
          transferToCurrencyCode: '',
          transferToCurrencySymbol: '',
        },
      };

/** given react hook form props convert to acceptable API request */
const formToRequest = (formData: FormInputs): CreateTransactionRequest => ({
  amount: formData.isDebit ? -Number(formData.amount) : Number(formData.amount),
  category: formData.category,
  createdAt: formData.createdAt,
  note: formData.note,
  currency: formData.extra.walletCurrencyCode,
  // walletId: formData.walletId,
  // currencySymbol: formData.extra.walletCurrencySymbol,
  tags: formData.tags,
  transferTo: {
    walletId: formData.transferTo,
    currency: {
      code: formData.extra.walletCurrencyCode,
      name: formData.extra.walletCurrencyCode,
      symbol: formData.extra.walletCurrencySymbol,
    },
  },
});

const styles = StyleSheet.create({
  sheetContainer: {
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.75,
    shadowRadius: 16.0,
    shadowColor: '#000',
    elevation: 24,
  },
  roundedButton: {
    borderRadius: 90,
    paddingVertical: 9,
  },
  transparentInput: {
    borderWidth: 0,
    backgroundColor: '#0000',
  },
});
