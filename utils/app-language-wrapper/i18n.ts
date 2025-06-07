import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      english: 'English',
      spanish: 'Spanish',
      french: 'French',
      profile: 'Profile',
      logout: 'Log Out',
      record: 'Record',
      gotIt: 'Got it',

      // setup
      setupProfile: 'Set up Your Profile',
      chooseTargetLanguage: 'Choose the language you want to practice',
      save: 'Save',
      back: 'Back',
      welcomeTitle: 'Welcome to Aurelia!',
      welcomeRecordInstruction:
        'Press and hold the record button to record speech in your target language',
      welcomeCorrectionsInstruction:
        'Once you’re done recording, your corrections will appear in the Grammar Review tab',

      //profile
      verifyEmail: 'Verify Email',
      conversations: 'Conversations',
      profileInfo: 'Profile Info',
      username: 'Username',
      enterUsername: 'Enter username',
      email: 'Email',
      enterEmail: 'Enter your email',
      languagePreferences: 'Language Preferences',
      appLanguage: 'App Language',
      targetLanguage: 'Target Language',
      updateUsername: 'Update Username',
      updateEmail: 'Update Email',
      googleEmailCannotBeChanged: 'Google account email cannot be changed',
      saveLanguagePreferences: 'Save Language Preferences',
      saving: 'Saving...',
      accountManagement: 'Account Management',
      currentPassword: 'Current Password',
      enterCurrentPassword: 'Enter current password',
      newPassword: 'New Password',
      enterNewPassword: 'Enter new password',
      updatePassword: 'Update Password',
      updating: 'Updating...',
      logOut: 'Log Out',

      // grammar review
      grammarReview: 'Grammar Review',
      searchCorrections: 'Search corrections...',
      noResultsFound: 'No results found for your search.',
      startRecording: 'Start recording to see your corrections here!',
      morningConversation: 'Morning Conversation',
      afternoonConversation: 'Afternoon Conversation',
      eveningConversation: 'Evening Conversation',
      youSaid: 'You said',
      corrected: 'Corrected',
      greatJobNoErrors: '🎊 Great job! No errors! 🎊',
      whatsWrong: "What's wrong",
      why: 'Why?',
      tryThisInstead: 'Try this instead',
      improvedClause: 'Improved clause',

      // Toast notifications
      signUpSuccessTitle: 'Sign Up Successful',
      signUpSuccessMessage:
        'You have successfully signed up! You can now log in.',
      signUpFailed: 'Sign Up Failed',
      loginFailed: 'Login Failed',
      pleaseEnterEmailAndPassword: 'Please enter both email and password.',
      success: 'Success',
      pleaseSelectLanguage: 'Please select a language.',
      setupComplete: 'Setup complete! You can now use the app.',
      setupFailed: 'Failed to save setup. Please try again.',
      profileUpdated: 'Your profile has been successfully updated.',
      noChanges: 'No Changes',
      noFieldsUpdated: 'No fields were updated.',
      error: 'Error',
      verificationEmailSent:
        'A verification email has been sent to your new address. Please verify your new email to complete the change.',
      requestVerificationEmailFailed: 'Failed to send verification email.',
      emailVerifiedSuccess: 'Your email has been verified!',
      emailVerifiedFailed: 'Verification failed.',
      invalidEmailFormat: 'Please enter a valid email address.',
      requestEmailChangeFailed: 'Failed to request email change.',
      profileUpdateFailed: 'Failed to update profile. Please try again.',
      passwordUpdated: 'Your password has been successfully updated.',
      passwordTooShort: 'Password must be at least 8 characters long.',
      currentPasswordIncorrect: 'Current password is incorrect',
      newPasswordSameAsCurrent:
        'New password cannot be the same as the current password',
      passwordUpdateError: 'Error updating password',
      passwordUpdateFailed: 'Failed to update password. Please try again.',
      resetPasswordEmailSentTitle: 'Reset Email Sent',
      resetPasswordEmailSentMessage: 'Check your inbox for a password reset link.',
      resetPasswordEmailFailed: 'Reset Email Failed',
      processingRecording: 'Processing Your Recording',
      processingRecordingMessage:
        'Hang tight! Check the Grammar Review tab for results.',
      recordingProcessed: 'Recording Processed',
      correctionsReady: 'Your corrections are ready!',
      errorSendingAudio: 'Error Sending Audio',
      unexpectedError: 'An unexpected error occurred.',
      noSpeechDetectedError:
        'No speech detected. Please record your voice and try again.',
      searchCorrectionsError: 'An error occurred while searching corrections',
      sessionExpiredError: 'Your session has expired. Please log in again.',
      serverError: 'A server error occurred. Please try again later.',

      // alerts
      confirmDeleteTitle: 'Delete Conversation',
      confirmDeleteMessage:
        'Are you sure you want to delete this conversation?',
      cancel: 'Cancel',
      delete: 'Delete',
      deleteError: 'Error',
      deleteErrorMessage:
        'Failed to delete the conversation. Please try again.',
    },
  },
  fr: {
    translation: {
      english: 'Anglais',
      spanish: 'Espagnol',
      french: 'Français',
      profile: 'Profil',
      logout: 'Se Déconnecter',
      record: 'Enregistrer',

      // setup
      setupProfile: 'Configurer votre profil',
      chooseTargetLanguage: 'Choisissez la langue que vous voulez pratiquer',
      save: 'Enregistrer',
      back: 'Retour',
      welcomeTitle: 'Bienvenue sur Aurelia !',
      welcomeRecordInstruction:
        'Appuyez et maintenez le bouton d’enregistrement pour enregistrer votre voix dans votre langue cible',
      welcomeCorrectionsInstruction:
        'Une fois l’enregistrement terminé, vos corrections apparaîtront dans l’onglet Révision de Grammaire',
      gotIt: 'Compris',

      // profile
      verifyEmail: "Vérifier l'e-mail",
      conversations: 'Conversations',
      profileInfo: 'Infos du Profil',
      username: "Nom d'utilisateur",
      enterUsername: 'Entrez votre nom d’utilisateur',
      email: 'E-mail',
      enterEmail: 'Entrez votre e-mail',
      languagePreferences: 'Préférences Linguistiques',
      appLanguage: "Langue de l'Application",
      targetLanguage: 'Langue Cible',
      updateUsername: "Mettre à jour le nom d'utilisateur",
      updateEmail: "Mettre à jour l'e-mail",
      googleEmailCannotBeChanged:
        "L'adresse e-mail du compte Google ne peut pas être modifiée",
      saveLanguagePreferences: 'Enregistrer les préférences linguistiques',
      saving: 'Enregistrement...',
      accountManagement: 'Gestion du Compte',
      currentPassword: 'Mot de Passe Actuel',
      enterCurrentPassword: 'Entrez le mot de passe actuel',
      newPassword: 'Nouveau Mot de Passe',
      enterNewPassword: 'Entrez le nouveau mot de passe',
      updatePassword: 'Mettre à Jour le Mot de Passe',
      updating: 'Mise à jour...',
      logOut: 'Se Déconnecter',

      // grammar review
      grammarReview: 'Révision de Grammaire',
      searchCorrections: 'Rechercher des corrections...',
      noResultsFound: 'Aucun résultat trouvé pour votre recherche.',
      startRecording: 'Commencez à enregistrer pour voir vos corrections ici !',
      morningConversation: 'Conversation du Matin',
      afternoonConversation: "Conversation de l'Après-Midi",
      eveningConversation: 'Conversation du Soir',
      youSaid: 'Vous avez dit',
      corrected: 'Corrigé',
      greatJobNoErrors: '🎊 Bon travail ! Pas d’erreurs ! 🎊',
      whatsWrong: 'Qu’est-ce qui ne va pas',
      why: 'Pourquoi ?',
      tryThisInstead: 'Essayez ceci à la place',
      improvedClause: 'Clause améliorée',

      // Toast notifications
      signUpSuccessTitle: 'Inscription réussie',
      signUpSuccessMessage:
        'Vous vous êtes inscrit avec succès ! Vous pouvez maintenant vous connecter.',
      signUpFailed: "Échec de l'inscription",
      loginFailed: 'Échec de la connexion',
      pleaseEnterEmailAndPassword:
        'Veuillez entrer votre e-mail et votre mot de passe.',
      success: 'Succès',
      pleaseSelectLanguage: 'Veuillez sélectionner une langue.',
      setupComplete:
        'Configuration terminée ! Vous pouvez maintenant utiliser l’application.',
      setupFailed:
        'Échec de l’enregistrement de la configuration. Veuillez réessayer.',
      profileUpdated: 'Votre profil a été mis à jour avec succès.',
      noChanges: 'Aucun changement',
      noFieldsUpdated: 'Aucun champ n’a été mis à jour.',
      error: 'Erreur',
      verificationEmailSent:
        'Un e-mail de vérification a été envoyé à votre nouvelle adresse. Veuillez vérifier votre nouvel e-mail pour finaliser le changement.',
      requestVerificationEmailFailed:
        "Échec de l'envoi de l'e-mail de vérification.",
      emailVerifiedSuccess: 'Votre e-mail a été vérifié !',
      emailVerifiedFailed: 'Échec de la vérification.',
      invalidEmailFormat: 'Veuillez saisir une adresse e-mail valide.',
      requestEmailChangeFailed: "Échec de la demande de changement d'e-mail.",
      profileUpdateFailed:
        'Échec de la mise à jour du profil. Veuillez réessayer.',
      passwordUpdated: 'Votre mot de passe a été mis à jour avec succès.',
      passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères.',
      currentPasswordIncorrect: 'Current password is incorrect',
      newPasswordSameAsCurrent:
        "Le nouveau mot de passe ne peut pas être identique à l'actuel",
      passwordUpdateError: 'Erreur lors de la mise à jour du mot de passe',
      passwordUpdateFailed:
        'Échec de la mise à jour du mot de passe. Veuillez réessayer.',
      resetPasswordEmailSentTitle: 'E-mail de réinitialisation envoyé',
      resetPasswordEmailSentMessage:
        'Vérifiez votre boîte de réception pour un lien de réinitialisation du mot de passe.',
      resetPasswordEmailFailed: 'Échec de l’envoi de l’e-mail de réinitialisation',
      processingRecording: 'Traitement de votre enregistrement',
      processingRecordingMessage:
        'Patientez ! Consultez l’onglet Revue grammaticale pour les résultats.',
      recordingProcessed: 'Enregistrement traité',
      correctionsReady: 'Vos corrections sont prêtes !',
      errorSendingAudio: 'Erreur lors de l’envoi de l’audio',
      unexpectedError: 'Une erreur inattendue est survenue.',
      noSpeechDetectedError:
        'Aucune voix détectée. Veuillez enregistrer votre voix et réessayer.',
      searchCorrectionsError:
        "Une erreur s'est produite lors de la recherche de corrections.",
      sessionExpiredError: 'Votre session a expiré. Veuillez vous reconnecter.',
      serverError:
        'Une erreur du serveur s’est produite. Veuillez réessayer plus tard.',

      // alerts
      confirmDeleteTitle: 'Supprimer la conversation',
      confirmDeleteMessage:
        'Êtes-vous sûr de vouloir supprimer cette conversation ?',
      cancel: 'Annuler',
      delete: 'Supprimer',
      deleteError: 'Erreur',
      deleteErrorMessage:
        'Échec de la suppression de la conversation. Veuillez réessayer.',
    },
  },
  es: {
    translation: {
      english: 'Inglés',
      spanish: 'Español',
      french: 'Francés',
      profile: 'Perfil',
      logout: 'Cerrar Sesión',
      record: 'Grabar',

      // setup
      setupProfile: 'Configura tu perfil',
      chooseTargetLanguage: 'Elige el idioma que quieres practicar',
      save: 'Guardar',
      back: 'Atrás',
      welcomeTitle: '¡Bienvenido a Aurelia!',
      welcomeRecordInstruction:
        'Mantén presionado el botón de grabar para grabar tu voz en tu idioma objetivo',
      welcomeCorrectionsInstruction:
        'Cuando termines de grabar, tus correcciones aparecerán en la pestaña Revisión de Gramática',
      gotIt: 'Entendido',

      // profile
      verifyEmail: 'Verificar correo electrónico',
      conversations: 'Conversaciones',
      profileInfo: 'Información del Perfil',
      username: 'Nombre de Usuario',
      enterUsername: 'Ingrese su nombre de usuario',
      email: 'Correo Electrónico',
      enterEmail: 'Ingrese su correo electrónico',
      languagePreferences: 'Preferencias de Idioma',
      appLanguage: 'Idioma de la Aplicación',
      targetLanguage: 'Idioma Objetivo',
      updateUsername: 'Actualizar nombre de usuario',
      updateEmail: 'Actualizar correo electrónico',
      googleEmailCannotBeChanged:
        'El correo electrónico de la cuenta de Google no se puede cambiar',
      saveLanguagePreferences: 'Guardar preferencias de idioma',
      saving: 'Guardando...',
      accountManagement: 'Gestión de la Cuenta',
      currentPassword: 'Contraseña Actual',
      enterCurrentPassword: 'Ingrese la contraseña actual',
      newPassword: 'Nueva Contraseña',
      enterNewPassword: 'Ingrese la nueva contraseña',
      updatePassword: 'Actualizar Contraseña',
      updating: 'Actualizando...',
      logOut: 'Cerrar Sesión',

      // grammar reivew
      grammarReview: 'Revisión de Gramática',
      searchCorrections: 'Buscar correcciones...',
      noResultsFound: 'No se encontraron resultados para tu búsqueda.',
      startRecording: 'Comienza a grabar para ver tus correcciones aquí.',
      morningConversation: 'Conversación de la Mañana',
      afternoonConversation: 'Conversación de la Tarde',
      eveningConversation: 'Conversación de la Noche',
      youSaid: 'Dijiste',
      corrected: 'Corregido',
      greatJobNoErrors: '🎊 ¡Buen trabajo! ¡Sin errores! 🎊',
      whatsWrong: 'Qué está mal',
      why: '¿Por qué?',
      tryThisInstead: 'Prueba esto en su lugar',
      improvedClause: 'Cláusula mejorada',

      // Toast notifications
      signUpSuccessTitle: 'Registro exitoso',
      signUpSuccessMessage:
        '¡Te has registrado con éxito! Ahora puedes iniciar sesión.',
      signUpFailed: 'Error al registrarse',
      loginFailed: 'Error al iniciar sesión',
      pleaseEnterEmailAndPassword:
        'Por favor, ingresa tu correo electrónico y contraseña.',
      success: 'Éxito',
      pleaseSelectLanguage: 'Por favor, selecciona un idioma.',
      setupComplete:
        '¡Configuración completa! Ahora puedes usar la aplicación.',
      setupFailed:
        'Error al guardar la configuración. Por favor, inténtalo de nuevo.',
      profileUpdated: 'Tu perfil se ha actualizado con éxito.',
      noChanges: 'Sin cambios',
      noFieldsUpdated: 'No se actualizaron campos.',
      error: 'Error',
      verificationEmailSent:
        'Se ha enviado un correo de verificación a tu nueva dirección. Por favor, verifica tu nuevo correo electrónico para completar el cambio.',
      requestVerificationEmailFailed:
        'No se pudo enviar el correo de verificación.',
      emailVerifiedSuccess: '¡Tu correo electrónico ha sido verificado!',
      emailVerifiedFailed: 'La verificación falló.',
      invalidEmailFormat:
        'Por favor, introduce una dirección de correo electrónico válida.',
      requestEmailChangeFailed:
        'No se pudo solicitar el cambio de correo electrónico.',
      profileUpdateFailed:
        'Error al actualizar el perfil. Por favor, inténtalo de nuevo.',
      passwordUpdated: 'Tu contraseña se ha actualizado con éxito.',
      passwordTooShort: 'La contraseña debe tener al menos 8 caracteres.',
      currentPasswordIncorrect: 'Current password is incorrect',
      newPasswordSameAsCurrent:
        'La nueva contraseña no puede ser igual a la actual',
      passwordUpdateError: 'Error al actualizar la contraseña',
      passwordUpdateFailed:
        'Error al actualizar la contraseña. Por favor, inténtalo de nuevo.',
      resetPasswordEmailSentTitle: 'Correo de restablecimiento enviado',
      resetPasswordEmailSentMessage:
        'Revisa tu bandeja de entrada para un enlace de restablecimiento de contraseña.',
      resetPasswordEmailFailed: 'Error al enviar el correo de restablecimiento',
      processingRecording: 'Procesando tu grabación',
      processingRecordingMessage:
        '¡Espera un momento! Consulta la pestaña de Revisión Gramatical para ver los resultados.',
      recordingProcessed: 'Grabación procesada',
      correctionsReady: '¡Tus correcciones están listas!',
      errorSendingAudio: 'Error al enviar el audio',
      unexpectedError: 'Ocurrió un error inesperado.',
      noSpeechDetectedError:
        'No se detectó voz. Por favor, graba tu voz e inténtalo de nuevo.',
      searchCorrectionsError: 'Ocurrió un error al buscar correcciones.',
      sessionExpiredError:
        'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
      serverError:
        'Ocurrió un error del servidor. Por favor, inténtalo de nuevo más tarde.',

      // alerts
      confirmDeleteTitle: 'Eliminar conversación',
      confirmDeleteMessage:
        '¿Estás seguro de que deseas eliminar esta conversación?',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      deleteError: 'Error',
      deleteErrorMessage:
        'No se pudo eliminar la conversación. Inténtalo de nuevo.',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
