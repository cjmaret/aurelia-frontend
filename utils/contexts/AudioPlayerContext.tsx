import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import {
  useAudioPlayer as useExpoAudioPlayer,
  AudioSource,
  setAudioModeAsync,
} from 'expo-audio';
import {
  getAudioForText,
  cleanupOldCacheFiles,
  clearAllCachedAudio,
} from '@/utils/functions/audioCache';
import { AudioPlayerContextType } from '@/types/types';

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(
  undefined,
);

export function useAudioPlayerContext() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error(
      'useAudioPlayerContext must be used within AudioPlayerProvider',
    );
  }
  return context;
}

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudioId, setCurrentAudioId] = useState<string | null>(null);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const player = useExpoAudioPlayer();

  useEffect(() => {
    cleanupOldCacheFiles().catch(console.error);

    if (__DEV__) {
      // @ts-ignore
      global.clearAudioCache = async () => {
        await clearAllCachedAudio();
        console.log('✅ Audio cache cleared!');
      };
      console.log('🔧 Dev tools: clearAudioCache()');
    }
  }, []);

  const setPlaybackRate = async (rate: number) => {
    setPlaybackRateState(rate);
    if (isPlaying && player.playing) {
      await player.setPlaybackRate(rate);
    }
  };

  const playFromText = async (text: string, audioId: string) => {
    try {
      setIsLoading(true);
      setCurrentAudioId(audioId);

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
        shouldPlayInBackground: false,
      });

      const audioFilePath = await getAudioForText(text);

      player.replace({ uri: audioFilePath } as AudioSource);
      await player.setPlaybackRate(playbackRate);
      player.volume = 1;
      await player.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio from text:', error);
      setIsPlaying(false);
      setCurrentAudioId(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const stopAudio = () => {
    try {
      player.pause();
      setIsPlaying(false);
      setCurrentAudioId(null);
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  const togglePlayPause = async (text: string, audioId: string) => {
    if (isPlaying && currentAudioId === audioId) {
      stopAudio();
    } else {
      await playFromText(text, audioId);
    }
  };

  // TODO: address this useEffect
  useEffect(() => {
    if (!isPlaying) return;

    let hasStartedPlaying = false;

    const checkInterval = setInterval(() => {
      if (!hasStartedPlaying && player.playing) {
        hasStartedPlaying = true;
      }

      if (hasStartedPlaying && !player.playing && !isLoading) {
        setIsPlaying(false);
        setCurrentAudioId(null);
        clearInterval(checkInterval);
      }
    }, 100);

    return () => clearInterval(checkInterval);
  }, [isPlaying]);

  return (
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        isLoading,
        currentAudioId,
        playbackRate,
        setPlaybackRate,
        togglePlayPause,
      }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}
