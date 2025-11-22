// Mock react-native-modal
jest.mock('react-native-modal', () => {
  const React = require('react');
  const { View } = require('react-native');
  
  return ({ isVisible, children, onBackdropPress }) => {
    if (!isVisible) return null;
    return React.createElement(
      View,
      { testID: 'modal-backdrop', onTouchEnd: onBackdropPress },
      children
    );
  };
});

// Mock expo-store-review
jest.mock('expo-store-review', () => ({
  isAvailableAsync: jest.fn(),
  requestReview: jest.fn(),
}));

// Mock Alert
global.alert = jest.fn();

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Alert.alert = jest.fn();
  return RN;
});
