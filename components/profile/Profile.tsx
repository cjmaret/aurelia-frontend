import { useEffect, useState } from 'react';
import {
  Modal,
  FlatList,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
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
  DeleteUserButton,
  DeleteUserButtonText,
  DeleteUserSubsection,
  VerifyEmailSaveButtonText,
  UsernameGroup,
  GoogleEmailNotificationText,
  IconWrapper,
} from './styledProfile';
import api from '@/lib/api';
import { UserDataType } from '@/types/types';
import { languageFlags, languageCodes } from '@/constants/profileConstants';
import { useCorrectionsData } from '@/utils/contexts/CorrectionsDataContext';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import {
  getTranslatedLanguageName,
  isValidEmail,
} from '@/utils/functions/generalFunctions';
import { useToastModal } from '@/utils/contexts/ToastModalContext';
import { showApiErrorToast } from '@/utils/functions/showApiErrorToast';
import LoadingSpinner from '../loading-spinner/LoadingSpinner';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const { showToast } = useToastModal();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const { getUserDetails, user, setUser, logout, deleteUser, isAuthenticated } =
    useAuth();
  const { pagination, resetPagination } = useCorrectionsData();
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
  const isGoogleUser = user?.oauthProvider === 'google' || false;

  useEffect(() => {
    if (token) {
      if (!isAuthenticated) {
        router.replace({ pathname: '/signIn', params: { token } });
      } else {
        async function handleVerifyEmail() {
          try {
            await api.verifyEmail(token as string);
            showToast('success', t('success'), t('emailVerifiedSuccess'));
            await getUserDetails();
          } catch (err) {
            showToast('error', t('error'), t('emailVerifiedFailed'));
          }
        }
        handleVerifyEmail();
      }
    }
  }, [token]);

  const handleRequestEmailVerification = async () => {
    if (user?.emailVerified) return;
    setLoading(true);
    try {
      await api.requestEmailVerification();
      showToast('success', t('success'), t('verificationEmailSent'));
    } catch (error) {
      showToast('error', t('error'), t('requestVerificationEmailFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleRequestEmailChange = async () => {
    if (!localUser?.userEmail) return;
    if (!isValidEmail(localUser.userEmail)) {
      showToast('error', t('error'), t('invalidEmailFormat'));
      return;
    }
    setLoading(true);
    try {
      await api.requestEmailChange({ newEmail: localUser.userEmail });
      showToast('success', t('success'), t('verificationEmailSent'));
    } catch (error) {
      showToast('error', t('error'), t('requestEmailChangeFailed'));
    } finally {
      setLoading(false);
    }
  };

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

  const hasFieldChanged = (
    key: string,
    localUser: UserDataType,
    user: UserDataType
  ): boolean => {
    return (
      localUser[key as keyof UserDataType] !== user[key as keyof UserDataType]
    );
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
      if (error?.status === 400) {
        showToast('error', t('error'), t('newPasswordSameAsCurrent'));
      } else if (error?.status === 403) {
        showToast('error', t('error'), t('currentPasswordIncorrect'));
      } else {
        showToast('error', t('error'), t('passwordUpdateFailed'));
      }
    } finally {
      setCurrentPassword('');
      setNewPassword('');
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      resetPagination();
      console.log('You have been logged out.');
    } catch (error: any) {
      showApiErrorToast({
        error,
        showToast,
        t,
      });
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteUser();
            resetPagination();
          },
        },
      ]
    );
  };

  if (!localUser || !user) {
    return (
      <Container>
        <Text>Error: Unable to load user data.</Text>
      </Container>
    );
  }

  const isRequestEmailChangeButtonDisabled =
    loading || !localUser.userEmail || localUser.userEmail === user.userEmail;

  const isUpdateUsernameButtonDisabled =
    loading || !localUser.username || localUser.username === user.username;

  const isSaveLanguagePreferencesButtonDisabled =
    loading ||
    !localUser.appLanguage ||
    !localUser.targetLanguage ||
    (localUser.appLanguage === user.appLanguage &&
      localUser.targetLanguage === user.targetLanguage);

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
              <UsernameGroup>
                <Name>{user.username}</Name>
                <IconWrapper>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color={
                      user.emailVerified
                        ? theme.colors.primary
                        : theme.colors.greySecondary
                    }
                  />
                </IconWrapper>
              </UsernameGroup>
              <Label>{user.userEmail}</Label>
              {!user.emailVerified && (
                <SaveButton
                  onPress={handleRequestEmailVerification}
                  style={{ marginBottom: 12 }}>
                  <VerifyEmailSaveButtonText>
                    {t('verifyEmail')}
                  </VerifyEmailSaveButtonText>
                </SaveButton>
              )}
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
                  placeholderTextColor={theme.colors.inputPlaceholder}
                  maxLength={25}
                />
                <SaveButton
                  onPress={handleSave}
                  disabled={isUpdateUsernameButtonDisabled}>
                  <SaveButtonText disabled={isUpdateUsernameButtonDisabled}>
                    {loading ? t('saving') : t('updateUsername')}
                  </SaveButtonText>
                </SaveButton>
                <Label>{t('email')}</Label>
                <Input
                  disabled={isGoogleUser}
                  editable={!isGoogleUser}
                  value={localUser.userEmail}
                  onChangeText={(text: string) =>
                    setLocalUser({
                      ...localUser,
                      userEmail: text.trim().toLowerCase(),
                    })
                  }
                  placeholder={t('enterEmail')}
                  placeholderTextColor={theme.colors.inputPlaceholder}
                  keyboardType="email-address"
                />
                {!isGoogleUser ? (
                  <SaveButton
                    onPress={handleRequestEmailChange}
                    disabled={isRequestEmailChangeButtonDisabled}
                    style={{ marginBottom: 12 }}>
                    <SaveButtonText
                      disabled={isRequestEmailChangeButtonDisabled}>
                      {loading ? 'Sending...' : t('updateEmail')}
                    </SaveButtonText>
                  </SaveButton>
                ) : (
                  <GoogleEmailNotificationText>
                    {t('googleEmailCannotBeChanged')}
                  </GoogleEmailNotificationText>
                )}
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
                    <DropdownButtonText
                      maxFontSizeMultiplier={2}
                      numberOfLines={2}>
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
                    <DropdownButtonText
                      maxFontSizeMultiplier={2}
                      numberOfLines={1}>
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
                disabled={isSaveLanguagePreferencesButtonDisabled}>
                <SaveButtonText
                  disabled={isSaveLanguagePreferencesButtonDisabled}>
                  {loading ? t('saving') : t('saveLanguagePreferences')}
                </SaveButtonText>
              </SaveButton>
            </ProfileInfoSection>
            {/* Account Management Subsection*/}
            {!isGoogleUser && (
              <SubSection style={{ marginTop: 40 }}>
                <SectionTitle>{t('accountManagement')}</SectionTitle>
                <Label>{t('currentPassword')}</Label>
                <Input
                  placeholder={t('enterCurrentPassword')}
                  placeholderTextColor={theme.colors.inputPlaceholder}
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={(text: string) => setCurrentPassword(text)}
                />
                <Label>{t('newPassword')}</Label>
                <Input
                  placeholder={t('enterNewPassword')}
                  placeholderTextColor={theme.colors.inputPlaceholder}
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
            )}
            <LogoutButton onPress={handleLogout}>
              <LogoutButtonText>{t('logOut')}</LogoutButtonText>
            </LogoutButton>
            {/* Delete Account Section */}
            <DeleteUserSubsection>
              <SectionTitle>Delete Account</SectionTitle>
              <Label>
                If you wish to delete your account, please click the button
                below.
              </Label>
              <DeleteUserButton onPress={confirmDelete}>
                <DeleteUserButtonText>Delete Account</DeleteUserButtonText>
              </DeleteUserButton>
            </DeleteUserSubsection>
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
                        <Text style={{ color: theme.colors.inputText }}>
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
      {loading && <LoadingSpinner />}
    </>
  );
}
