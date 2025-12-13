import { useAudioPlayerContext } from '@/utils/contexts/AudioPlayerContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components/native';
import { AudioPlayIconContainer } from './styledAudioPlayer';

export default function AudioPlayer({
  sentenceId,
}: {
  correctedSentence: string;
  sentenceId: string;
}) {
  const theme: any = useTheme();
  const { isPlaying, isLoading, currentAudioId } = useAudioPlayerContext();

  const isThisPlaying = isPlaying && currentAudioId === sentenceId;

  return (
    <AudioPlayIconContainer
      disabled={isLoading && currentAudioId === sentenceId}>
      {isLoading && currentAudioId === sentenceId ? (
        <ActivityIndicator
          size="small"
          color={theme.colors.snippetTextCorrected}
        />
      ) : (
        <MaterialCommunityIcons
          name={isThisPlaying ? 'stop' : 'volume-high'}
          size={20}
          color={theme.colors.snippetTextCorrected}
        />
      )}
    </AudioPlayIconContainer>
  );
}
