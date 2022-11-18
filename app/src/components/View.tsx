import { Layout, LayoutProps } from '@ui-kitten/components';

type Props = {
  level?: '0' | '1' | '2' | '3' | '4';
};
export const View = ({ level = '0', ...props }: Omit<LayoutProps, 'level'> & Props) =>
  level === '0' ? (
    <Layout {...props} style={[props.style, { backgroundColor: '#0000' }]} />
  ) : (
    <Layout {...props} level={level} />
  );
