import { useState } from 'react';
import { Alert } from 'react-native';
import * as StoreReview from 'expo-store-review';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
import {
  RatingModalContainer,
  RatingModalTitle,
  RatingModalDescription,
  RatingButtonRow,
  FeedbackModalContainer,
  FeedbackModalTitle,
  FeedbackModalDescription,
  FeedbackTextInput,
  FeedbackButtonRow,
  SecondaryButton,
  PrimaryButton,
  SecondaryButtonText,
  PrimaryButtonText,
} from './styledReviewPrompt';

interface ReviewPromptProps {
  isVisible: boolean;
  onClose: () => void;
  onFeedbackSubmit?: (feedback: string) => void;
}

export default function ReviewPrompt({
  isVisible,
  onClose,
  onFeedbackSubmit,
}: ReviewPromptProps) {
  const { t } = useTranslation();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handlePositiveResponse = async () => {
    onClose();
    setTimeout(async () => {
      if (await StoreReview.isAvailableAsync()) {
        StoreReview.requestReview();
      } else {
        Alert.alert(
          t('rateAureliaAlertTitle'),
          t('rateAureliaAlertDescription'),
          [
            { text: t('maybeLater'), style: 'cancel' },
            { text: t('rateNow'), onPress: () => StoreReview.requestReview() },
          ]
        );
      }
    }, 500);
  };

  const handleNegativeResponse = () => {
    setShowFeedbackForm(true);
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      onFeedbackSubmit?.(feedback);
      setFeedback('');
      setShowFeedbackForm(false);
      onClose();
      Alert.alert(t('thankYouAlertTitle'), t('thankYouAlertDescription'));
    }
  };

  const handleFeedbackCancel = () => {
    setFeedback('');
    setShowFeedbackForm(false);
    onClose();
  };

  if (showFeedbackForm) {
    return (
      <Modal isVisible={isVisible} onBackdropPress={handleFeedbackCancel}>
        <FeedbackModalContainer>
          <FeedbackModalTitle>
            {t('reviewPromptTitle')}
          </FeedbackModalTitle>
          <FeedbackModalDescription>
            {t('reviewPromptDescription')}
          </FeedbackModalDescription>
          <FeedbackTextInput
            value={feedback}
            onChangeText={setFeedback}
            placeholder={t('feedbackPlaceholder')}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <FeedbackButtonRow>
            <SecondaryButton onPress={handleFeedbackCancel}>
              <SecondaryButtonText>{t('cancel')}</SecondaryButtonText>
            </SecondaryButton>
            <PrimaryButton onPress={handleFeedbackSubmit}>
              <PrimaryButtonText>
                {t('submitButtonText')}
              </PrimaryButtonText>
            </PrimaryButton>
          </FeedbackButtonRow>
        </FeedbackModalContainer>
      </Modal>
    );
  }

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <RatingModalContainer>
        <RatingModalTitle>
          {t('enjoyingAureliaTitle')}
        </RatingModalTitle>
        <RatingModalDescription>
          {t('enjoyingAureliaDescription')}
        </RatingModalDescription>
        <RatingButtonRow>
          <SecondaryButton onPress={handleNegativeResponse}>
            <SecondaryButtonText>{t('notReally')}</SecondaryButtonText>
          </SecondaryButton>
          <PrimaryButton onPress={handlePositiveResponse}>
            <PrimaryButtonText>
              {t('yes')}
            </PrimaryButtonText>
          </PrimaryButton>
        </RatingButtonRow>
      </RatingModalContainer>
    </Modal>
  );
}
