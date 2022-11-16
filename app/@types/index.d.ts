type $OmitChild<T extends { children?: React.ReactNode }> = Omit<T, 'children'>;

type $Children = {
  children: React.ReactNode;
};

type $WithId = { id?: string };

type $ObjectWithPrefix<T = string, K extends object> = Record<`${T}${keyof K}`, K[keyof K]>;
