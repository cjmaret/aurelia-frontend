import { ActivityIndicator } from "react-native";
import { useTheme } from "styled-components/native";
import { LoadingOverlay } from "./styledLoadingSpinner";

export default function LoadingSpinner() {
  const theme: any = useTheme();

  return (
    <LoadingOverlay>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </LoadingOverlay>
  );
}
