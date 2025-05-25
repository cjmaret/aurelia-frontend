import { useMemo, useState } from 'react';
import {
  Modal,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';
import { useAuth } from '@/utils/contexts/AuthContext';
import {
  Container,
  Header,
  ProfilePicture,
  ProfileInfoSection,
  SubSection,
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
  SectionTitle,
  SaveButtonText,
  Name,
  LoadingOverlay,
} from './styledProfile';
import api from '@/lib/api';
import { UserDataType } from '@/types/types';
import { languageFlags, languageCodes } from '@/constants/profileConstants';
import { useCorrectionsData } from '@/utils/contexts/CorrectionsDataContext';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { getTranslatedLanguageName } from '@/utils/functions/generalFunctions';
import { useToastModal } from '@/utils/contexts/ToastModalContext';
import { showApiErrorToast } from '@/utils/functions/handleApiError';

export default function Profile() {
  const { showToast } = useToastModal();
  const { user, setUser, logout } = useAuth();
  const { pagination } = useCorrectionsData();
  const theme: any = useTheme();
  const { t } = useTranslation();
  const [localUser, setLocalUser] = useState<UserDataType | null>(user);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'speaking' | 'correction'>(
    'speaking'
  );
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

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

        showToast('success', t('success'), t('profileUpdated'));
      } else {
        showToast('info', t('noChanges'), t('noFieldsUpdated'));
      }
    } catch (error) {
      showToast('error', t('error'), t('profileUpdateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log('You have been logged out.');
    } catch (error: any) {
      showApiErrorToast({
        status: error?.status || 0,
        message: error?.message || 'Unknown error',
        showToast,
        t,
      });
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

  const handlePasswordUpdate = async () => {
    if (newPassword.length < 8) {
      showToast('error', t('error'), t('passwordTooShort'));
      return;
    }

    setLoading(true);
    try {
      await api.updateUserPassword({
        currentPassword,
        newPassword: newPassword,
      });

      showToast('success', t('success'), t('passwordUpdated'));
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      showToast('error', t('error'), t('passwordUpdateFailed'));
    } finally {
      setCurrentPassword('');
      setNewPassword('');
      setLoading(false);
    }
  };

  if (!localUser || !user) {
    return (
      <Container>
        <Text>Error: Unable to load user data.</Text>
      </Container>
    );
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets={true}>
          <Container>
            <Header>
              <ProfilePicture source={languageFlags[user.targetLanguage]} />
              <Name>{user.username}</Name>
              <Label>{user.userEmail}</Label>
            </Header>

            {/* Progress Section */}
            <SubSection>
              <Stat>
                <StatLabel>{t('conversations')}</StatLabel>
                <StatValue>{pagination.total}</StatValue>
              </Stat>
              {/* <Stat>
            <StatLabel>Milestones</StatLabel>
            <StatValue>5 Achieved</StatValue>
          </Stat> */}
            </SubSection>

            <ProfileInfoSection>
              {/* Edit Profile Info Subsection*/}
              <SubSection>
                <SectionTitle>{t('profileInfo')}</SectionTitle>
                <Label>{t('username')}</Label>
                <Input
                  value={localUser.username}
                  onChangeText={(text: string) =>
                    setLocalUser({ ...localUser, username: text })
                  }
                  placeholder={t('enterUsername')}
                />
                <Label>{t('email')}</Label>
                <Input
                  value={localUser.userEmail}
                  onChangeText={(text: string) =>
                    setLocalUser({ ...localUser, userEmail: text })
                  }
                  placeholder={t('enterEmail')}
                  keyboardType="email-address"
                />
              </SubSection>

              {/* Language Preferences Subsection*/}
              <SubSection>
                <SectionTitle>{t('languagePreferences')}</SectionTitle>
                <Label>{t('appLanguage')}</Label>
                <LanguagePickerWrapper>
                  <DropdownButton
                    onPress={() => {
                      setModalType('speaking');
                      setModalVisible(true);
                    }}>
                    <DropdownButtonText>
                      {getTranslatedLanguageName({
                        code: localUser.appLanguage,
                        t,
                      })}
                    </DropdownButtonText>
                  </DropdownButton>
                </LanguagePickerWrapper>

                <Label>{t('targetLanguage')}</Label>
                <LanguagePickerWrapper>
                  <DropdownButton
                    onPress={() => {
                      setModalType('correction');
                      setModalVisible(true);
                    }}>
                    <DropdownButtonText>
                      {getTranslatedLanguageName({
                        code: localUser.targetLanguage,
                        t,
                      })}
                    </DropdownButtonText>
                  </DropdownButton>
                </LanguagePickerWrapper>
              </SubSection>
              <SaveButton
                onPress={handleSave}
                disabled={!hasChanges || loading}>
                <SaveButtonText disabled={!hasChanges || loading}>
                  {loading ? t('saving') : t('saveProfileChanges')}
                </SaveButtonText>
              </SaveButton>
            </ProfileInfoSection>

            {/* Account Management Subsection*/}
            <SubSection>
              <SectionTitle>{t('accountManagement')}</SectionTitle>
              <Label>{t('currentPassword')}</Label>
              <Input
                placeholder={t('enterCurrentPassword')}
                secureTextEntry
                value={currentPassword}
                onChangeText={(text: string) => setCurrentPassword(text)}
              />
              <Label>{t('newPassword')}</Label>
              <Input
                placeholder={t('enterNewPassword')}
                secureTextEntry
                value={newPassword}
                onChangeText={(text: string) => setNewPassword(text)}
              />
              <SaveButton
                onPress={handlePasswordUpdate}
                disabled={!currentPassword || !newPassword || loading}>
                <SaveButtonText
                  disabled={!currentPassword || !newPassword || loading}>
                  {loading ? t('updating') : t('updatePassword')}
                </SaveButtonText>
              </SaveButton>
            </SubSection>

            <LogoutButton onPress={handleLogout}>
              <LogoutButtonText>{t('logOut')}</LogoutButtonText>
            </LogoutButton>

            <Modal
              visible={isModalVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setModalVisible(false)}>
              <ModalOverlay onPress={() => setModalVisible(false)}>
                <ModalContent>
                  <FlatList
                    data={languageCodes}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <ModalItem onPress={() => handleLanguageSelect(item)}>
                        <Text>
                          {getTranslatedLanguageName({ code: item, t })}
                        </Text>
                      </ModalItem>
                    )}
                  />
                </ModalContent>
              </ModalOverlay>
            </Modal>
          </Container>
        </ScrollView>
      </TouchableWithoutFeedback>
      {loading && (
        <LoadingOverlay>
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
          />
        </LoadingOverlay>
      )}
    </>
  );
}
