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
      <GoogleButtonText maxFontSizeMultiplier={1.3} numberOfLines={1}>
        Google
      </GoogleButtonText>
    </GoogleButtonContainer>
  );
}
