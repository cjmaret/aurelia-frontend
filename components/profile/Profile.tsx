import React, { useMemo, useState } from 'react';
import { Alert, Modal, FlatList, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '@/utils/contexts/AuthContext';
import {
  Container,
  Header,
  ProfilePicture,
  Section,
  Label,
  Input,
  SaveButton,
  LogoutButton,
  LogoutButtonText,
  LanguagePickerWrapper,
  DropdownButton,
  DropdownButtonText,
  ModalOverlay,
  ModalContent,
  ModalItem,
  Stat,
  StatLabel,
  StatValue,
  ScrollView,
} from './styledProfile';
import api from '@/lib/api';
import { UserDataType } from '@/types/types';
import { languageFlags, languages } from '@/constants/profileConstants';
import { capitalizeFirstLetter } from '@/utils/functions/generalFunctions';

export default function Profile() {
  const { logout } = useAuth();
  const { user, setUser } = useAuth();
  const [localUser, setLocalUser] = useState<UserDataType | null>(user);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'speaking' | 'correction'>(
    'speaking'
  );
  const [loading, setLoading] = useState(false);

  const hasFieldChanged = (
    key: string,
    localUser: UserDataType,
    user: UserDataType
  ): boolean => {
    return (
      localUser[key as keyof UserDataType] !== user[key as keyof UserDataType]
    );
  };

  const hasChanges = useMemo(() => {
    if (!localUser || !user) return false;

    return Object.keys(localUser).some(
      (key) => localUser && user && hasFieldChanged(key, localUser, user)
    );
  }, [localUser, user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      // construct the body with only changed fields
      const updatedFields: Record<string, string | boolean> = {};
      for (const key in localUser) {
        if (localUser && user && hasFieldChanged(key, localUser, user)) {
          updatedFields[key] = localUser[key as keyof typeof localUser] as
            | string
            | boolean;
        }
      }

      // only make the call if there are changes
      if (Object.keys(updatedFields).length > 0) {
        const updatedUser = await api.updateUserDetails(updatedFields);

        setUser(updatedUser);
        setLocalUser(updatedUser);

        Alert.alert('Success', 'Your profile has been successfully updated.');
      } else {
        Alert.alert('No Changes', 'No fields were updated.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log('You have been logged out.');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleLanguageSelect = (language: string) => {
    if (modalType === 'speaking') {
      localUser &&
        setLocalUser({ ...localUser, appLanguage: language.toLowerCase() });
    } else {
      localUser &&
        setLocalUser({ ...localUser, targetLanguage: language.toLowerCase() });
    }
    setModalVisible(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!localUser || !user) {
    return (
      <Container>
        <Text>Error: Unable to load user data.</Text>
      </Container>
    );
  }

  return (
    <ScrollView>
      <Container>
        {/* Header Section */}
        <Header>
          <ProfilePicture source={languageFlags[user.targetLanguage]} />
          <Label>{user.username}</Label>
          <Label>{user.userEmail}</Label>
        </Header>

        {/* Progress Section */}
        <Section>
          <Stat>
            <StatLabel>Conversations</StatLabel>
            <StatValue>25</StatValue>
          </Stat>
          <Stat>
            <StatLabel>Milestones</StatLabel>
            <StatValue>5 Achieved</StatValue>
          </Stat>
        </Section>

        {/* Edit Profile Info */}
        <Section>
          <Label>Username</Label>
          <Input
            value={localUser.username}
            onChangeText={(text: string) =>
              setLocalUser({ ...localUser, username: text })
            }
            placeholder="Enter your username"
          />
          <Label>Email</Label>
          <Input
            value={localUser.userEmail}
            onChangeText={(text: string) =>
              setLocalUser({ ...localUser, userEmail: text })
            }
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        </Section>

        {/* Language Preferences */}
        <Section>
          <Label>App Language</Label>
          <LanguagePickerWrapper>
            <DropdownButton
              onPress={() => {
                setModalType('speaking');
                setModalVisible(true);
              }}>
              <DropdownButtonText>
                {capitalizeFirstLetter(localUser.appLanguage)}
              </DropdownButtonText>
            </DropdownButton>
          </LanguagePickerWrapper>

          <Label>Target Language</Label>
          <LanguagePickerWrapper>
            <DropdownButton
              onPress={() => {
                setModalType('correction');
                setModalVisible(true);
              }}>
              <DropdownButtonText>
                {capitalizeFirstLetter(localUser.targetLanguage)}
              </DropdownButtonText>
            </DropdownButton>
          </LanguagePickerWrapper>
        </Section>

        {/* Account Management */}
        <Section>
          <Label>Password</Label>
          <Input placeholder="Enter new password" secureTextEntry />
          <SaveButton
            title={loading ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            disabled={!hasChanges || loading}
          />
        </Section>

        {/* Logout Button */}
        <LogoutButton onPress={handleLogout}>
          <LogoutButtonText>Log Out</LogoutButtonText>
        </LogoutButton>

        {/* Reusable Modal */}
        <Modal
          visible={isModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}>
          <ModalOverlay onPress={() => setModalVisible(false)}>
            <ModalContent>
              <FlatList
                data={languages}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <ModalItem onPress={() => handleLanguageSelect(item)}>
                    <Text>{item}</Text>
                  </ModalItem>
                )}
              />
            </ModalContent>
          </ModalOverlay>
        </Modal>

        {/* Loading Indicator */}
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
      </Container>
    </ScrollView>
  );
}
