import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type ThemedToastProps = {
  type: 'info' | 'success' | 'error';
  theme: any;
  text1?: string;
  text2?: string;
};

const getBorderColor = (type: 'info' | 'success' | 'error', theme: any) => {
  if (type === 'success') return theme.colors.toastPrimary;
  if (type === 'error') return theme.colors.toastPrimaryError;
  return theme.colors.toastPrimary;
};

const getIcon = (type: 'info' | 'success' | 'error', theme: any) => {
  if (type === 'success')
    return (
      <MaterialIcons
        name="check-circle"
        size={28}
        color={theme.colors.toastPrimary}
        style={{ marginRight: 12 }}
      />
    );
  if (type === 'error')
    return (
      <MaterialIcons
        name="error"
        size={28}
        color={theme.colors.toastPrimaryError}
        style={{ marginRight: 12 }}
      />
    );
  return (
    <MaterialIcons
      name="hourglass-empty"
      size={28}
      color={theme.colors.toastPrimary}
      style={{ marginRight: 12 }}
    />
  );
};

export const ThemedToast = ({
  type,
  theme,
  text1,
  text2,
}: ThemedToastProps) => {
  return (
    <View
      style={{
        maxWidth: '90%',
        backgroundColor: theme.colors.toastBackground,
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 24,
        alignSelf: 'center',
        marginTop: 40,
        shadowColor: theme.colors.toastShadow,
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderLeftWidth: 6,
        borderLeftColor: getBorderColor(type, theme),
      }}>
      {getIcon(type, theme)}
      <View style={{ flex: 1 }}>
        {text1 ? (
          <Text
            maxFontSizeMultiplier={2}
            numberOfLines={2}
            style={{
              color: theme.colors.toastText,
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: text2 ? 4 : 0,
            }}>
            {text1}
          </Text>
        ) : null}
        {text2 ? (
          <Text
            maxFontSizeMultiplier={2}
            numberOfLines={4}
            style={{ color: theme.colors.toastText, fontSize: 14 }}>
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  );
};
