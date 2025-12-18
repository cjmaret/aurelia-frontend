import { MaterialCommunityIcons } from '@expo/vector-icons';
import { t } from 'i18next';
import {
  CorrectedItem,
  SnippetContentHeader,
  SnippetContainerLeft,
  SnippetContentHeaderLabelContainer,
  IconContainer,
  CorrectedHeaderLabelText,
  CorrectedHeaderValueText,
  SnippetContainerRight,
  ErrorHeaderLabelText,
  ErrorHeaderValueText,
  ErrorItem,
  ErrorArrowIcon,
} from '../review-card/styledReviewCard';
import AudioPlayer from '../audio-player/AudioPlayer';
import { useTheme } from 'styled-components/native';
import { SentenceFeedback } from '@/types/types';
import { TouchableOpacity } from 'react-native';
import { useAudioPlayerContext } from '@/utils/contexts/AudioPlayerContext';
import { JSX, ReactNode } from 'react';

type SnippetItemProps = {
  sentence: SentenceFeedback;
  combinedHighlightedText: (
    original: string,
    corrected: string
  ) => (string | JSX.Element | (string | JSX.Element)[])[];
} & (
  | { variant: 'corrected' }
  | { variant: 'youSaid' }
  | {
      variant: 'error';
      error: any;
      isExpanded: boolean;
      onToggle: () => void;
      highlightSearchedText: (text: string) => ReactNode;
      children?: ReactNode;
    }
);

export default function SnippetItem(props: SnippetItemProps) {
  const theme: any = useTheme();
  const { togglePlayPause } = useAudioPlayerContext();
  const { sentence, combinedHighlightedText, variant } = props;

  const config = {
    corrected: {
      icon: 'check-bold' as const,
      label: t('corrected'),
      color: theme.colors.snippetTextCorrected,
      Container: CorrectedItem,
      LabelText: CorrectedHeaderLabelText,
      ValueText: CorrectedHeaderValueText,
    },
    youSaid: {
      icon: 'check-bold' as const,
      label: t('youSaid'),
      color: theme.colors.snippetTextCorrected,
      Container: CorrectedItem,
      LabelText: CorrectedHeaderLabelText,
      ValueText: CorrectedHeaderValueText,
    },
    error: {
      icon: 'alert-circle' as const,
      label: t('whatsWrong'),
      color: theme.colors.snippetTextError,
      Container: ErrorItem,
      LabelText: ErrorHeaderLabelText,
      ValueText: ErrorHeaderValueText,
    },
  };

  const { icon, label, color, Container, LabelText, ValueText } =
    config[variant];

  const handlePress = () => {
    if (variant === 'error') {
      props.onToggle();
    } else {
      togglePlayPause(sentence.corrected, sentence.id);
    }
  };

  const content = (
    <SnippetContentHeader>
      <SnippetContainerLeft>
        <SnippetContentHeaderLabelContainer>
          <IconContainer>
            <MaterialCommunityIcons
              name={icon}
              size={variant === 'error' ? 24 : 20}
              color={color}
            />
          </IconContainer>
          <LabelText>{label}:</LabelText>
        </SnippetContentHeaderLabelContainer>

        <ValueText key={sentence.id}>
          {variant === 'error' && props.error
            ? props.highlightSearchedText(props.error.error)
            : combinedHighlightedText(sentence.original, sentence.corrected)}
        </ValueText>
      </SnippetContainerLeft>

      <SnippetContainerRight>
        {variant === 'error' ? (
          <ErrorArrowIcon>
            <MaterialCommunityIcons
              name={props.isExpanded ? 'chevron-up' : 'chevron-down'}
              size={25}
              color={color}
            />
          </ErrorArrowIcon>
        ) : (
          <AudioPlayer
            correctedSentence={sentence.corrected}
            sentenceId={sentence.id}
          />
        )}
      </SnippetContainerRight>
    </SnippetContentHeader>
  );

  if (variant === 'error') {
    return (
      <Container>
        <TouchableOpacity onPress={handlePress}>{content}</TouchableOpacity>
        {props.isExpanded && props.children}
      </Container>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <Container>{content}</Container>
    </TouchableOpacity>
  );
}
