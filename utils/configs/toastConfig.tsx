import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export type ThemedToastProps = {
  type: 'info' | 'success' | 'error';
  theme: any;
  text1?: string;
  text2?: string;
};

const getBorderColor = (type: 'info' | 'success' | 'error', theme: any) => {
  if (type === 'success') return theme.colors.primary;
  if (type === 'error') return theme.colors.snippetErrorText;
  return theme.colors.primary;
};

const getIcon = (type: 'info' | 'success' | 'error', theme: any) => {
  if (type === 'success')
    return (
      <MaterialIcons
        name="check-circle"
        size={28}
        color={theme.colors.primary}
        style={{ marginRight: 12 }}
      />
    );
  if (type === 'error')
    return (
      <MaterialIcons
        name="error"
        size={28}
        color={theme.colors.snippetErrorText}
        style={{ marginRight: 12 }}
      />
    );
  return (
    <MaterialIcons
      name="hourglass-empty"
      size={28}
      color={theme.colors.primary}
      style={{ marginRight: 12 }}
    />
  );
};

export const ThemedToast = ({ type, theme, text1, text2 }: ThemedToastProps) => {
  return (
    <View
      style={{
        maxWidth: '90%',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 24,
        alignSelf: 'center',
        marginTop: 40,
        shadowColor: '#000',
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
            style={{
              color: '#111',
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: text2 ? 4 : 0,
            }}>
            {text1}
          </Text>
        ) : null}
        {text2 ? (
          <Text style={{ color: '#111', fontSize: 14 }}>{text2}</Text>
        ) : null}
      </View>
    </View>
  );
};
