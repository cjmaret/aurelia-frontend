import { useRef, useEffect, useState } from 'react';
import { Animated, TouchableWithoutFeedback, View } from 'react-native';
import {
  BubbleContainer,
  BubbleText,
  BubbleTitle,
  GotItButton,
  GotItText,
} from './styledOnboardingBubbles';
import { useTranslation } from 'react-i18next';

export default function OnboardingBubbles({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const bubbles = [
    {
      title: t('welcomeTitle'),
      text: t('welcomeRecordInstruction'),
    },
    {
      text: t('welcomeCorrectionsInstruction'),
    },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const handleNext = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      if (step < bubbles.length - 1) {
        setStep(step + 1);
      } else {
        onFinish();
      }
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handleNext}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <BubbleContainer style={{ opacity: fadeAnim }} step={step}>
          {bubbles[step]?.title && (
            <BubbleTitle>{bubbles[step].title}</BubbleTitle>
          )}
          <BubbleText>{bubbles[step].text}</BubbleText>
          <GotItButton onPress={handleNext} activeOpacity={0.8}>
            <GotItText>{t('gotIt')}</GotItText>
          </GotItButton>
        </BubbleContainer>
      </View>
    </TouchableWithoutFeedback>
  );
}
