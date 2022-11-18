import { BottomSheetBackdrop, BottomSheetProps } from '@gorhom/bottom-sheet';
// eslint-disable-next-line max-len
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

const renderBackdrop = (props: BottomSheetDefaultBackdropProps) => (
  <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior={'close'} />
);

export const bottomSheetProps: Omit<BottomSheetProps, 'children'> = {
  animateOnMount: true,
  detached: true,
  enableOverDrag: true,
  enablePanDownToClose: true,
  bottomInset: 46,
  index: -1,
  snapPoints: ['55%'],
  backdropComponent: renderBackdrop,
};
