import { useAudioPlayerContext } from '@/utils/contexts/AudioPlayerContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from 'styled-components/native';
import { AudioPlayButton } from './styledAudioPlayer';

export default function AudioPlayer({
  correctedSentence,
  sentenceId,
}: {
  correctedSentence: string;
  sentenceId: string;
}) {
  const theme: any = useTheme();
  const { isPlaying, isLoading, currentAudioId, togglePlayPause } =
    useAudioPlayerContext();

  const isThisPlaying = isPlaying && currentAudioId === sentenceId;

  return (
    <AudioPlayButton
      onPress={() => togglePlayPause(correctedSentence, sentenceId)}
      disabled={isLoading && currentAudioId === sentenceId}>
      {isLoading && currentAudioId === sentenceId ? (
        <ActivityIndicator size="small" color={theme.colors.textSecondary} />
      ) : (
        <MaterialCommunityIcons
          name={isThisPlaying ? 'stop' : 'volume-high'}
          size={20}
          color={theme.colors.textCorrected}
        />
      )}
    </AudioPlayButton>
  );
}
