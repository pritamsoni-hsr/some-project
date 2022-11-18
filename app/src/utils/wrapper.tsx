import { RecoilRoot } from 'recoil';

export const RecoilWrapper = (props: $Children) => {
  return <RecoilRoot>{props.children}</RecoilRoot>;
};
