import colors from '@/assets/globalStyles';
import styled from 'styled-components/native';

export const ScrollView = styled.ScrollView`
  flex: 1;
  padding: 16px;
  background-color: #f8f9fa;
`;

export const Container = styled.View`
  flex: 1;
  padding: 25px 0 100px 0;
`;

export const Header = styled.View`
  align-items: center;
  margin-bottom: 24px;
`;

export const ProfilePicture = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 16px;
`;

export const Name = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
`;

export const Email = styled.Text`
  font-size: 16px;
  color: #6c757d;
`;

export const Section = styled.View`
  margin-bottom: 24px;
`;

export const Label = styled.Text`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;

export const Input = styled.TextInput`
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 0 8px;
`;

export const Stat = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

export const StatLabel = styled.Text`
  font-size: 16px;
  color: #6c757d;
`;

export const StatValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

export const LanguagePickerWrapper = styled.View`
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 16px;
  justify-content: center;
  padding: 0 8px;
`;

export const DropdownButton = styled.TouchableOpacity`
  height: 100%;
  justify-content: center;
`;

export const DropdownButtonText = styled.Text`
  font-size: 16px;
  color: #333;
`;

export const SaveButton = styled.Button`
  margin-top: 16px;
`;

export const LogoutButton = styled.TouchableOpacity`
  margin-top: 16px;
  padding: 12px;
  background-color: ${colors.secondary};
  border-radius: 8px;
  align-items: center;
`;

export const LogoutButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const ModalOverlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.View`
  width: 80%;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
`;

export const ModalItem = styled.TouchableOpacity`
  padding: 12px;
  border-bottom-width: 1px;
  border-bottom-color: #ccc;
`;
