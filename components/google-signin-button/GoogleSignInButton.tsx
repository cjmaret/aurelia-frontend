import {
  GoogleButtonContainer,
  GoogleButtonIcon,
  GoogleButtonText,
} from './styledGoogleSignInButton';
import GoogleIcon from '@/assets/images/google-icon.png';

export default function GoogleSignInButton({
  handleGoogleSignIn,
}: {
  handleGoogleSignIn: () => void;
}) {
  return (
    <GoogleButtonContainer onPress={handleGoogleSignIn} activeOpacity={0.6}>
      <GoogleButtonIcon source={GoogleIcon} />
      <GoogleButtonText>Google</GoogleButtonText>
    </GoogleButtonContainer>
  );
}
