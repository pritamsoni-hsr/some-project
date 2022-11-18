import * as Haptics from 'expo-haptics';

const haptics = () => Haptics.selectionAsync();
haptics.light = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
haptics.medium = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
haptics.heavy = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

haptics.success = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
haptics.warning = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
haptics.error = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

export { haptics };
