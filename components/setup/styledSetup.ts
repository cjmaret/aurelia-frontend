import colors from '@/assets/globalStyles';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  padding: 16px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  margin-bottom: 10px;
  color: #555;
`;

export const ListContainer = styled.View`
  max-height: 300px;
`;

const SetupButton = styled.TouchableOpacity``;

export const LanguageButton = styled(SetupButton)<{ selected: boolean }>`
  background-color: ${({ selected }: { selected: boolean }) =>
    selected ? colors.secondary : '#ccc'};
  padding: 10px 20px;
  border-radius: 5px;
  margin-top: 20px;
`;

export const SaveButton = styled(SetupButton)`
  background-color: ${colors.secondary};
  padding: 16px;
  border-radius: 7px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;
