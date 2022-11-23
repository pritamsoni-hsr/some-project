import { useCallback, useEffect } from 'react';
import { Controller, FormProvider, useForm, useFormContext } from 'react-hook-form';
import { Keyboard, ScrollView, StyleSheet } from 'react-native';

import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { Button, Input, Layout } from '@ui-kitten/components';

import {
  ActivityBar,
  DatePicker,
  Error,
  Grid,
  Loader,
  Selector,
  SidePadding,
  Spacer,
  Text,
  View,
} from '@app/components';
import { bottomSheetProps } from '@app/defaults';
import { useBottomSheetRef, useTheme } from '@app/hooks';
import {
  ErrMessage,
  TransactionResponse as Transaction,
  Categories as TransactionBudgetEnum,
  WalletResponse as Wallet,
  Categories as WalletCategoryEnum,
  populateError,
  useWallets,
} from 'common';

import { DefaultCategoryData } from '../data';
import { useGetWalletById } from '../hooks';
import { CardIcon } from './CardIcon';

enum IncomeType {
  Income = 'income',
  Expense = 'expense',
  Transfer = 'transfer',
}

type FormInputs = Omit<Transaction, 'amount'> & {
  additional: { onType: IncomeType };
  wallet: string;
  currency: string;
  currencySymbol: string;
  amount: string;
  budget: string;
};

export const TransactionCreateOne = (props: {
  tx?: Transaction;
  onSubmit?: (e: Transaction, walletId: string) => Promise<Transaction>;
}) => {
  const formHooks = useForm<FormInputs>({
    defaultValues: {
      note: '',
      createdAt: new Date().addDays(-1),
      isDebit: true,
      more: {
        tags: [],
        transferTo: '',
        ...props.tx?.more,
      },
      ...props.tx,
      amount: `${Math.abs(props.tx?.amount || 0) || ''}`,
    },
  });
  const { setValue } = formHooks;

  useEffect(() => {
    if (props.tx?.more.transferTo) setValue('additional.onType', IncomeType.Transfer);
    else if (!props.tx?.isDebit) setValue('additional.onType', IncomeType.Income);
    else setValue('additional.onType', IncomeType.Expense);
  }, [props.tx?.isDebit, props.tx?.more.transferTo, setValue]);

  const { colors } = useTheme();
  const backgroundColor = colors.background;

  const editable = !false;

  const navigation = useNavigation();

  const sheetA = useBottomSheetRef();
  const sheetB = useBottomSheetRef();

  const isDebit = formHooks.watch('isDebit');

  const currentWalletId = formHooks.watch('wallet');
  const currentWallet = useGetWalletById(currentWalletId);
  const currentWalletSymbol = currentWallet?.currencySymbol;

  const onSubmit = async (formData: FormInputs) => {
    await props
      .onSubmit?.({ ...formData, amount: Number(formData.amount) }, formData.wallet)
      .catch(populateError(formHooks.setError));
    Keyboard.dismiss();
    formHooks.reset();
    navigation.canGoBack() && navigation.goBack();
  };

  return (
    <FormProvider {...formHooks}>
      <ScrollView keyboardDismissMode={'on-drag'}>
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

        <SidePadding>
          <Spacer />
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start' }}>
            <Text size={28}>{currentWalletSymbol}</Text>
            <Controller
              control={formHooks.control}
              name={'amount'}
              render={({ field, fieldState }) => (
                <Input
                  autoFocus
                  enablesReturnKeyAutomatically
                  caption={fieldState.error?.message}
                  editable={editable}
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
                pattern: ErrMessage.pattern(/^\d{1,9}$/),
              }}
            />
          </View>
          <Spacer />

          <Controller
            control={formHooks.control}
            name={'note'}
            render={param => (
              <Input
                {...param.field}
                caption={param.fieldState.error?.message}
                clearButtonMode={'always'}
                editable={editable}
                label={'Note'}
                placeholder={'Add Note'}
                status={param.fieldState.error ? 'danger' : 'info'}
                style={[styles.transparentInput, { borderBottomWidth: 1 }]}
                onChangeText={param.field.onChange}
              />
            )}
            rules={{
              required: ErrMessage.required(),
            }}
          />
          <Spacer />

          {/* <Controller
            control={formHooks.control}
            name={'more.tags'}
            render={({ field }) => (
              <Input
                {...field}
                caption={'separate tags with comma'}
                label={'Tags'}
                value={field.value.join(', ')}
                onChangeText={e => field.onChange(e.split(', '))}
              />
            )}
          /> */}
          <Spacer />

          <TransferMoney />

          <View style={{ alignItems: 'flex-start' }}>
            <Controller
              control={formHooks.control}
              name={'createdAt'}
              render={({ field }) => (
                <DatePicker
                  collapsable
                  display={'compact'}
                  maximumDate={new Date()}
                  mode={'date'}
                  value={field.value}
                  onChange={d => {
                    field.onChange(d);
                    field.onBlur();
                  }}
                />
              )}
            />
          </View>

          <Spacer />

          {/* <TextWithInfo label='Category' onPress={() => navigation.navigate('FinanceCategories')} /> */}
          {/* <TextWithInfo label='Budget' onPress={() => navigation.navigate('FinanceImportance')} /> */}
          {/* <Spacer size={4} /> */}
          <Controller
            control={formHooks.control}
            name={'budget'}
            render={({ field: { ref: _, ...rest } }) => (
              <Selector.Enum {...rest} label={'Budget'} options={TransactionBudgetEnum} placeholder={'budget'} />
            )}
          />

          <Spacer />

          <Layout style={styles.row}>
            <View style={[styles.row, { display: isDebit ? 'flex' : 'none' }]}>
              <Button size={'small'} style={styles.roundedButton} onPress={sheetA.open}>
                From
              </Button>
              <Spacer direction={'horizontal'} />
              <Button size={'small'} style={styles.roundedButton} onPress={sheetB.open}>
                On
              </Button>
            </View>
            <View style={[{ display: !isDebit ? 'flex' : 'none' }]}>
              <Button size={'small'} style={styles.roundedButton} onPress={sheetB.open}>
                Select Account
              </Button>
            </View>
            <Button
              // disabled={formHooks.formState.isSubmitting || !formHooks.formState.isValid}
              size={'small'}
              style={styles.roundedButton}
              onPress={formHooks.handleSubmit(onSubmit)}>
              Save
            </Button>
          </Layout>
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
        <Expenses onClose={sheetB.close} />
      </BottomSheet>
    </FormProvider>
  );
};

type Collapsable = { onClose: () => void };

const WalletPicker = ({ onClose }: Collapsable) => {
  const response = useWallets();

  const { setValue, watch } = useFormContext<FormInputs>();
  const expenseWallet = watch('wallet');

  const onPress = useCallback(
    (value: string) => {
      setValue('wallet', value);
      setTimeout(() => onClose(), 200);
    },
    [setValue, onClose],
  );

  const renderItem = useCallback(
    (item: Wallet) => <CardIcon {...item} key={item.id} selected={item.id === expenseWallet} onPress={onPress} />,
    [expenseWallet, onPress],
  );

  if (response.isLoading) return <Loader />;
  if (response.isError) return <Error />;

  return (
    <BottomSheetScrollView showsVerticalScrollIndicator={false}>
      <Grid data={response.data.results} renderItem={renderItem} />
    </BottomSheetScrollView>
  );
};

const Expenses = ({ onClose }: Collapsable) => {
  const response = useWallets();

  const { setValue, watch, resetField } = useFormContext<FormInputs>();
  const isDebit = watch('isDebit');

  useEffect(() => {
    if (isDebit) setValue('additional.onType', IncomeType.Expense);
    else setValue('additional.onType', IncomeType.Income);
  }, [isDebit, setValue]);

  const onPress = useCallback(
    (onType: IncomeType) => (value: string) => {
      switch (onType) {
        case IncomeType.Income:
          setValue('wallet', value);
          setValue('category', 'Income');
          setValue('more.transferTo', '');
          setValue('additional.onType', IncomeType.Income);
          break;
        case IncomeType.Expense:
          resetField('wallet');
          setValue('category', value);
          setValue('more.transferTo', '');
          setValue('additional.onType', IncomeType.Expense);
          break;
        case IncomeType.Transfer:
          resetField('wallet');
          setValue('category', 'Transfer');
          setValue('more.transferTo', value);
          setValue('additional.onType', IncomeType.Transfer);
          break;
      }
      setTimeout(() => onClose(), 200);
    },
    [setValue, onClose, resetField],
  );

  const isItemSelected = useCallback(
    (itemId: string) => {
      switch (watch('additional.onType')) {
        case IncomeType.Income:
          return watch('wallet') === itemId;
        case IncomeType.Expense:
          return watch('category') === itemId;
        case IncomeType.Transfer:
          return watch('more.transferTo') === itemId;
      }
    },
    [watch],
  );

  const renderItem = useCallback(
    (onType: IncomeType) => (item: typeof DefaultCategoryData[number] | Wallet) => {
      const selected = isItemSelected(item.id);
      return <CardIcon {...item} selected={selected} onPress={onPress(onType)} />;
    },
    [onPress, isItemSelected],
  );

  const filterIncomeWallets = useCallback((e: Wallet) => e.category === WalletCategoryEnum.Income, []);

  if (response.isLoading) return <Loader />;
  if (response.isError) return <Error />;

  if (!isDebit)
    return (
      <BottomSheetScrollView showsVerticalScrollIndicator={false}>
        <Text center>Income</Text>
        <Spacer />
        <Grid data={response.data.results.filter(filterIncomeWallets)} renderItem={renderItem(IncomeType.Income)} />
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

  const currentWallet = useGetWalletById(formHooks.watch('wallet'));
  const transferToWallet = useGetWalletById(formHooks.watch('more.transferTo'));

  if (formHooks.watch('additional.onType') !== IncomeType.Transfer) return null;
  if (currentWallet.currency === transferToWallet?.currency) return null;

  return (
    <View>
      <Input
        accessoryLeft={() => <Text>{currentWallet.currencySymbol}</Text>}
        accessoryRight={() => (
          <Text>
            {currentWallet.currencySymbol} {'->'} {transferToWallet?.currencySymbol}
          </Text>
        )}
        label={'service charge'}
      />

      <Input accessoryLeft={() => <Text>{transferToWallet?.currencySymbol}</Text>} label={'Amount received'} />
    </View>
  );
};

/** given react hook form props convert to acceptable API request */
export const propsToForm = () => {};

/** given API response convert to desired react hook form initial state */
export const formToProps = () => {};

const styles = StyleSheet.create({
  amount: {
    backgroundColor: '#0004',
    fontSize: 32,
    color: '#fff',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
