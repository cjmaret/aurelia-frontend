import { useRouter } from 'expo-router';
import {
  GetStartedButton,
  GetStartedButtonText,
  JellyfishImageContainer,
  WavesImageContainer,
  WelcomeContainer,
  WelcomeSubContainerLower,
  WelcomeSubContainerUpper,
  WelcomeText,
  WelcomeTextContainer,
  WelcomeTitle,
} from './styledWelcome';

export default function Welcome() {
  const router = useRouter();

  const handleContinue = () => {
    router.replace('/(setup)/setupTab');
  };

  return (
    <WelcomeContainer>
      <WelcomeSubContainerUpper>
        <WavesImageContainer
          source={require('../../assets/images/welcome-waves.png')}
        />
        <JellyfishImageContainer
          source={require('../../assets/images/aurelia-splash-screen-icon.png')}
        />
      </WelcomeSubContainerUpper>
      <WelcomeSubContainerLower>
        <WelcomeTitle>Welcome to Aurelia!</WelcomeTitle>
        <WelcomeTextContainer>
          <WelcomeText>
            Aurelia enhances your language skills with real-time feedback.
          </WelcomeText>
          <WelcomeText>
            Record, correct, and track your speech progress effortlessly.
          </WelcomeText>
        </WelcomeTextContainer>
        <GetStartedButton onPress={handleContinue}>
          <GetStartedButtonText>Get Started</GetStartedButtonText>
        </GetStartedButton>
      </WelcomeSubContainerLower>
    </WelcomeContainer>
  );
}
