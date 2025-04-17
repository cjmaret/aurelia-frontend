import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { View, Animated, Easing, TouchableOpacity } from 'react-native';
import { RecordButton, ButtonText } from './styledRecordButton';

export default function RecordButtonComponent({
  recording,
  startRecording,
  stopRecording,
}: {
  recording: any;
  startRecording: any;
  stopRecording: any;
}) {
  const [ripples, setRipples] = useState<
    { id: number; scale: Animated.Value; opacity: Animated.Value }[]
  >([]);
  const rippleInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (recording) {
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
  }, [recording]);

  const triggerRipple = () => {
    const newRipple = {
      id: Date.now(),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
    };

    setRipples((prevRipples) => [...prevRipples, newRipple]);

    Animated.parallel([
      Animated.timing(newRipple.scale, {
        toValue: 2, // scale circle outward
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

  const handlePressIn = () => {
    startRecording();
  };

  const handlePressOut = () => {
    stopRecording();
  };

  return (
    <View>
      {ripples.map(({ id, scale, opacity }) => (
        <Animated.View
          key={id}
          style={{
            position: 'absolute',
            width: 100,
            height: 100,
            borderRadius: 50,
            transform: [{ scale }],
            opacity,
            borderColor: '#a5b3db',
            borderWidth: 1,
          }}
        />
      ))}
      <RecordButton
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        isRecording={recording}>
        <ButtonText>{recording ? 'Stop' : 'Press & Hold to Record'}</ButtonText>
      </RecordButton>
    </View>
  );
}
