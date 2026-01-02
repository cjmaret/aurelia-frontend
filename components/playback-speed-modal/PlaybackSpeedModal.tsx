import {
  PlaybackSpeedButton,
  PlaybackSpeedModalContainer,
  PlaybackSpeedValue,
} from './styledPlaybackSpeedModal';
import { useAudioPlayerContext } from '@/utils/contexts/AudioPlayerContext';

const playbackSpeeds = [
  {
    value: '1x',
    rate: 1,
  },
  {
    value: '0.7x',
    rate: 0.7,
  },
];

export default function PlaybackSpeedModal() {
  const { playbackRate, setPlaybackRate, isLoading } = useAudioPlayerContext();

  const handleButtonPress = async (rate: number) => {
    if (isLoading) return;
    await setPlaybackRate(rate);
  };

  return (
    <PlaybackSpeedModalContainer>
      {playbackSpeeds
        .map(({ value, rate }) => {
          const isSelected = playbackRate === rate;
          return (
            <PlaybackSpeedButton
              isSelected={isSelected}
              disabled={isLoading}
              key={rate}
              onPress={() => handleButtonPress(rate)}>
              <PlaybackSpeedValue isSelected={isSelected}>
                {value}
              </PlaybackSpeedValue>
            </PlaybackSpeedButton>
          );
        })
        .reverse()}
    </PlaybackSpeedModalContainer>
  );
}
