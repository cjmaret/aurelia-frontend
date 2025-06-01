import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { RecordButton, RecordButtonContainer } from './styledRecordButton';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import * as Haptics from 'expo-haptics';

export default function RecordButtonComponent({
  startRecording,
  stopRecording,
  isRecordButtonPressed,
  setIsRecordButtonPressed,
  disabled,
}: {
  startRecording: any;
  stopRecording: any;
  isRecordButtonPressed: boolean;
  setIsRecordButtonPressed: React.Dispatch<React.SetStateAction<boolean>>;
  disabled: boolean;
}) {
  const [ripples, setRipples] = useState<
    { id: number; scale: Animated.Value; opacity: Animated.Value }[]
  >([]);
  const rippleInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const theme: any = useTheme();

  useEffect(() => {
    if (isRecordButtonPressed) {
      // start generating ripples continuously
      rippleInterval.current = setInterval(triggerRipple, 1000);
      triggerRipple();
    } else {
      // stop generating new ripples
      if (rippleInterval.current) {
        clearInterval(rippleInterval.current);
        rippleInterval.current = null;
      }
    }

    return () => {
      if (rippleInterval.current) clearInterval(rippleInterval.current);
    };
  }, [isRecordButtonPressed]);

  const triggerRipple = () => {
    const newRipple = {
      id: Date.now(),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
    };

    setRipples((prevRipples) => [...prevRipples, newRipple]);

    Animated.parallel([
      Animated.timing(newRipple.scale, {
        toValue: 1.6, // scale circle outward
        duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(newRipple.opacity, {
        toValue: 0, // fade out
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setRipples((prevRipples) =>
        prevRipples.filter((r) => r.id !== newRipple.id)
      );
    });
  };

  console.log('disabled', disabled);

  const handlePressIn = async () => {
    if (disabled) return; // prevent interaction if disabled
    // for immediate style changes
    setIsRecordButtonPressed(true);
    for (let i = 0; i < 3; i++) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    startRecording();
  };

  const handlePressOut = () => {
    setIsRecordButtonPressed(false);
    stopRecording();
  };

  return (
    <RecordButtonContainer>
      {ripples.map(({ id, scale, opacity }) => (
        <Animated.View
          key={id}
          style={{
            position: 'absolute',
            width: 145,
            height: 145,
            borderRadius: 140,
            transform: [{ scale }],
            opacity,
            borderColor: theme.colors.rippleBorder,
            borderWidth: 1,
          }}
        />
      ))}
      <RecordButton
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        isRecordButtonPressed={isRecordButtonPressed}>
        <Ionicons
          name="mic-outline"
          size={55}
          color={theme.colors.textPrimary}
        />
      </RecordButton>
    </RecordButtonContainer>
  );
}
