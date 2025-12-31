import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { RecordButton, RecordButtonContainer } from './styledRecordButton';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native';
import * as Haptics from 'expo-haptics';

export default function RecordButtonComponent({
  isAudioPermissionGranted,
  startRecording,
  stopRecording,
  resetButtonState,
  isTapRecording,
  isTapRecordingRef,
  isButtonPressed,
  setIsButtonPressed,
  disabled,
  isVisuallyDisabled,
  setElapsedTime
}: {
  isAudioPermissionGranted: boolean;
  startRecording: () => void;
  stopRecording: any;
  resetButtonState: () => void;
  isTapRecording: boolean;
  isTapRecordingRef: React.MutableRefObject<boolean>;
  isButtonPressed: boolean;
  setIsButtonPressed: (pressed: boolean) => void;
  disabled: boolean;
  isVisuallyDisabled?: boolean;
  setElapsedTime: (seconds: number) => void;
}) {
  const [ripples, setRipples] = useState<
    { id: number; scale: Animated.Value; opacity: Animated.Value }[]
  >([]);
  const rippleInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const theme: any = useTheme();

  useEffect(() => {
    if (isTapRecording && isAudioPermissionGranted) {
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
  }, [isTapRecording]);

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

  const playHeavyHaptic = async () => {
    for (let i = 0; i < 2; i++) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  };

  const handlePressIn = async () => {
    // show visuals if not already recording
    if (!isTapRecordingRef.current) {
      playHeavyHaptic();
      setIsButtonPressed(true);
      setElapsedTime(0)
    }
  };

  const handlePressOut = async () => {
    if (disabled || !isAudioPermissionGranted) {
      playHeavyHaptic();
      setIsButtonPressed(false);
      return;
    }

    playHeavyHaptic();

    // if recording, stop, if not recording, start
    if (isTapRecordingRef.current) {
      resetButtonState();
      stopRecording();
    } else {
      setIsButtonPressed(true);
      isTapRecordingRef.current = true;
      startRecording();
    }
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
        isRecordButtonPressed={isButtonPressed}
        isVisuallyDisabled={isVisuallyDisabled}>
        <Ionicons
          name={isTapRecording ? 'stop' : 'mic-outline'}
          size={55}
          color={theme.colors.textPrimary}
        />
      </RecordButton>
    </RecordButtonContainer>
  );
}
