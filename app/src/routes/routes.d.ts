import { NavigatorScreenParams } from '@react-navigation/native';

type Wallet = import('common/api/openapi').WalletResponse;
type Transaction = import('common/api/openapi').TransactionResponse;

type DetailScreen<Item = unknown> = Required<$WithId> & { item?: Item };

declare global {
  type NotesRouting = {
    List: undefined;
    Detail?: DetailScreen<{ note: string }>;
  };

  type FinanceRouting = {
    Transactions: undefined;
    // Wallets: undefined;
    Preferences: undefined;
  };
  type FinanceStack = {
    Home: NavigatorScreenParams<FinanceRouting>;
    TxByCategory?: {
      id: string;
    };
  };

  type AppRouting = {
    Root: undefined;
    Login: undefined;
    NotFound: undefined;
    Preferences: undefined;

    HTMLView?: {
      uri: string;
      title: string;
    };

    OpenInWhatsApp: undefined;

    Notes: NavigatorScreenParams<NotesRouting>;

    WalletDetail?: DetailScreen<Wallet>;
    WalletCreate: undefined;

    TxDetail?: DetailScreen<Transaction>;
    TxCreate: undefined;

    Finance: NavigatorScreenParams<FinanceStack>;
    Wallets: undefined;

    Categories: undefined;
    CategoryCreate: undefined;
  };

  namespace ReactNavigation {
    interface RootParamList extends AppRouting {}
  }
}
