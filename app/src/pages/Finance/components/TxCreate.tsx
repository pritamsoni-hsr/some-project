import { useCallback, useEffect } from 'react';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { Keyboard, ScrollView, StyleSheet } from 'react-native';

import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { Button, Datepicker, Input } from '@ui-kitten/components';
import moment from 'moment';
import { useDebouncedCallback } from 'use-debounce';

import { ActivityBar, Error, Grid, Icon, Loader, Row, SidePadding, Spacer, Text, View } from '@app/components';
import { bottomSheetProps } from '@app/defaults';
import { arrayToText, useBottomSheetRef, useTheme } from '@app/hooks';
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

import { CardIcon } from './CardIcon';
import { IncomeType, SpendCategories } from './data';

const FeedbackTimeoutMS = 350; // debounce timeout to make transition smooth for visual feedback to the user

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

export const TxCreate = (props: {
  tx?: TransactionResponse;
  wallet?: WalletResponse;
  onSubmit: (e: CreateTransactionRequest, walletId: string) => Promise<TransactionResponse>;
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
    await props.onSubmit({ ...formToRequest(formData) }, formData.walletId).catch(populateError(formHooks.setError));

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
            render={({ field, fieldState }) => (
              <Input
                {...field}
                caption={fieldState.error?.message}
                clearButtonMode={'always'}
                label={'Note'}
                placeholder={'Add Note'}
                status={fieldState.error ? 'danger' : 'info'}
                style={[styles.transparentInput, { borderBottomWidth: 1 }]}
                textStyle={{ marginHorizontal: 0 }}
                onChangeText={field.onChange}
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
              <Input {...field} {...arrayToText(field)} caption={'separate tags with comma'} label={'Tags'} />
            )}
          />
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
          <TransferLabels />
          <Spacer />
          <TransferMoney />

          <Controller
            name={'walletId'}
            render={({ fieldState }) => (
              // TODO: display selected option
              <View>
                <Button
                  appearance={fieldState.error ? 'outline' : 'filled'}
                  size={'small'}
                  status={fieldState.error ? 'danger' : 'info'}
                  onPress={sheetA.open}>
                  From
                </Button>
                <Text status={fieldState.error ? 'danger' : 'info'} variant={'caption2'} weight={'thin'}>
                  {fieldState.error?.message}
                </Text>
              </View>
            )}
          />
          <Controller
            name={'category'}
            render={({ fieldState }) => (
              // TODO: display selected option
              <View>
                <Button
                  appearance={fieldState.error ? 'outline' : 'filled'}
                  size={'small'}
                  status={fieldState.error ? 'danger' : 'info'}
                  onPress={sheetB.open}>
                  On
                </Button>
                <Text status={fieldState.error ? 'danger' : 'info'} variant={'caption2'} weight={'thin'}>
                  {fieldState.error?.message}
                </Text>
              </View>
            )}
            rules={{
              required: ErrMessage.required(),
            }}
          />
          <Spacer />
          <Button
            disabled={formHooks.formState.isSubmitting}
            size={'small'}
            onPress={formHooks.handleSubmit(onSubmit)}>
            Save
          </Button>
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

const TransferLabels = () => {
  const { watch } = useFormContext<FormInputs>();

  const budget = watch('extra.budget');
  const walletId = watch('walletId');
  const transferTo = watch('transferTo');

  if (budget !== IncomeType.Transfer) return null;

  return (
    <Row justifyContent={'center'}>
      <Text>{walletId}</Text>
      <Spacer direction={'horizontal'} />
      <Icon name={'arrow-forward'} status={'basic'} />
      <Spacer direction={'horizontal'} />
      <Text>{transferTo}</Text>
    </Row>
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
            testID={'amountInput'}
            textStyle={{ fontSize: 20, marginHorizontal: 0 }}
            value={field.value}
            onChangeText={field.onChange}
          />
        )}
        rules={{
          required: ErrMessage.required(),
          pattern: ErrMessage.pattern(/^\d+\.?\d*$/, 'Please enter a number'),
        }}
      />
    </View>
  );
};

const TransferMoney = () => {
  const formHooks = useFormContext<FormInputs>();

  const budget = formHooks.watch('extra.budget');
  const walletCurrency = formHooks.watch('extra.walletCurrencySymbol');
  const transferToCurrency = formHooks.watch('extra.transferToCurrencySymbol');

  if (budget !== IncomeType.Transfer) return null;

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

type CloseHandler = { onClose: () => void };

const WalletPicker = ({ onClose }: CloseHandler) => {
  const response = useWallets();

  const { setValue, watch } = useFormContext<FormInputs>();

  const isDebit = watch('isDebit');
  const walletId = watch('walletId');
  const isTransferType = watch('extra.budget') === IncomeType.Transfer;
  const transferTo = watch('transferTo');

  const debouncedOnClose = useDebouncedCallback(onClose, FeedbackTimeoutMS);

  const onPress = useCallback(
    (item: WalletResponse) => {
      setValue('walletId', item.id);
      setValue('extra.walletCurrencyCode', item.currency);
      setValue('extra.walletCurrencySymbol', item.currencySymbol);
      debouncedOnClose();
    },
    [setValue, debouncedOnClose],
  );

  // if type is transfer and transferTo is set, filter it out.
  const filterIncomeWallet = (e: WalletResponse) => e.category === Categories.Income;

  // remove transferTo wallets;
  const filterOutReceivers = (e: WalletResponse) => (isTransferType ? e.id !== transferTo : true);

  const renderItem = useCallback(
    (item: WalletResponse) => <CardIcon {...item} key={item.id} selected={item.id === walletId} onPress={onPress} />,
    [walletId, onPress],
  );

  if (response.isLoading) return <Loader />;
  if (response.isError) return <Error />;

  return (
    <BottomSheetScrollView showsVerticalScrollIndicator={false}>
      <Text center>Select Account</Text>
      <Spacer />
      <Grid
        data={response.data.results.filter(isDebit ? filterOutReceivers : filterIncomeWallet)}
        renderItem={renderItem}
      />
    </BottomSheetScrollView>
  );
};

const TxCategoryPicker = ({ onClose }: CloseHandler) => {
  const response = useWallets();

  const { setValue, watch, trigger } = useFormContext<FormInputs>();

  const isDebit = watch('isDebit');
  const selectedWallet = watch('walletId');
  const category = watch('category');
  const transferTo = watch('transferTo');

  useEffect(() => {
    setValue('category', undefined);
    // reset transfer information
    setValue('transferTo', undefined);

    setValue('extra.budget', isDebit ? IncomeType.Expense : IncomeType.Income);
  }, [isDebit, setValue]);

  const debouncedOnClose = useDebouncedCallback(() => {
    trigger('category'); // trigger validation to update error state on "On" button
    onClose();
  }, FeedbackTimeoutMS);

  const onPress = useCallback(
    (onType: IncomeType) => (item: typeof SpendCategories[number]) => {
      setValue('category', item.id);
      setValue('extra.budget', onType);
      setValue('transferTo', undefined);
      debouncedOnClose();
    },
    [setValue, debouncedOnClose],
  );

  const renderItem = useCallback(
    (onType: IncomeType) => (item: typeof SpendCategories[number]) => {
      return <CardIcon {...item} selected={category === item.id} onPress={onPress(onType)} />;
    },
    [onPress, category],
  );

  const onPressWallet = useCallback(
    (item: WalletResponse) => {
      // TODO: add more transfer categories
      setValue('category', IncomeType.Transfer);
      setValue('extra.budget', IncomeType.Transfer);
      setValue('transferTo', item.id);
      setValue('extra.transferToCurrencyCode', item.currency);
      setValue('extra.transferToCurrencySymbol', item.currencySymbol);
      debouncedOnClose();
    },
    [setValue, debouncedOnClose],
  );
  const renderWalletItem = useCallback(
    (item: WalletResponse) => <CardIcon {...item} selected={transferTo === item.id} onPress={onPressWallet} />,
    [onPressWallet, transferTo],
  );

  if (response.isLoading) return <Loader />;
  if (response.isError) return <Error />;

  if (!isDebit)
    return (
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        <Text center>Income</Text>
        <Spacer />
        <Grid
          data={SpendCategories.filter(e => e.type === IncomeType.Income)}
          renderItem={renderItem(IncomeType.Income)}
        />
      </BottomSheetScrollView>
    );

  return (
    <BottomSheetScrollView showsVerticalScrollIndicator={false}>
      <Text center>Expense</Text>
      <Spacer />
      <Grid
        data={SpendCategories.filter(e => e.type === IncomeType.Expense)}
        renderItem={renderItem(IncomeType.Expense)}
      />

      <Text center>Transfer</Text>
      <Spacer />
      <Grid data={response.data.results.filter(e => e.id !== selectedWallet)} renderItem={renderWalletItem} />
    </BottomSheetScrollView>
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
        isDebit: wallet?.category !== 'income',
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
  transferTo: formData.transferTo
    ? {
        walletId: formData.transferTo,
        currency: {
          code: formData.extra.walletCurrencyCode,
          name: formData.extra.walletCurrencyCode,
          symbol: formData.extra.walletCurrencySymbol,
        },
      }
    : undefined,
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
    width: 80,
  },
  inputPair: {
    width: 240,
  },
  transparentInput: {
    borderWidth: 0,
    backgroundColor: '#0000',
  },
});
