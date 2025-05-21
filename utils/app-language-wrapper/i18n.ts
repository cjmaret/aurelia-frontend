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

      // setup
      setupProfile: 'Set up Your Profile',
      chooseTargetLanguage: 'Choose the language you want to practice',
      save: 'Save',
      back: 'Back',

      //profile
      conversations: 'Conversations',
      profileInfo: 'Profile Info',
      username: 'Username',
      enterUsername: 'Enter username',
      email: 'Email',
      enterEmail: 'Enter your email',
      languagePreferences: 'Language Preferences',
      appLanguage: 'App Language',
      targetLanguage: 'Target Language',
      saveProfileChanges: 'Save Profile Changes',
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
      success: 'Success',
      pleaseSelectLanguage: 'Please select a language.',
      setupComplete: 'Setup complete! You can now use the app.',
      setupFailed: 'Failed to save setup. Please try again.',
      profileUpdated: 'Your profile has been successfully updated.',
      noChanges: 'No Changes',
      noFieldsUpdated: 'No fields were updated.',
      error: 'Error',
      profileUpdateFailed: 'Failed to update profile. Please try again.',
      passwordUpdated: 'Your password has been successfully updated.',
      passwordTooShort: 'Password must be at least 8 characters long.',
      passwordUpdateError: 'Error updating password',
      passwordUpdateFailed: 'Failed to update password. Please try again.',
      processingRecording: 'Processing Your Recording',
      processingRecordingMessage:
        'Hang tight! Check the Grammar Review tab for results.',
      recordingProcessed: 'Recording Processed',
      correctionsReady: 'Your corrections are ready!',
      errorSendingAudio: 'Error Sending Audio',
      unexpectedError: 'An unexpected error occurred.',
      noSpeechDetectedError:
        'No speech detected. Please record your voice and try again.',
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

      // profile
      conversations: 'Conversations',
      profileInfo: 'Infos du Profil',
      username: "Nom d'utilisateur",
      enterUsername: 'Entrez votre nom d’utilisateur',
      email: 'E-mail',
      enterEmail: 'Entrez votre e-mail',
      languagePreferences: 'Préférences Linguistiques',
      appLanguage: "Langue de l'Application",
      targetLanguage: 'Langue Cible',
      saveProfileChanges: 'Enregistrer les Modifications du Profil',
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
      profileUpdateFailed:
        'Échec de la mise à jour du profil. Veuillez réessayer.',
      passwordUpdated: 'Votre mot de passe a été mis à jour avec succès.',
      passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères.',
      passwordUpdateError: 'Erreur lors de la mise à jour du mot de passe',
      passwordUpdateFailed:
        'Échec de la mise à jour du mot de passe. Veuillez réessayer.',
      processingRecording: 'Traitement de votre enregistrement',
      processingRecordingMessage:
        'Patientez ! Consultez l’onglet Revue grammaticale pour les résultats.',
      recordingProcessed: 'Enregistrement traité',
      correctionsReady: 'Vos corrections sont prêtes !',
      errorSendingAudio: 'Erreur lors de l’envoi de l’audio',
      unexpectedError: 'Une erreur inattendue est survenue.',
      noSpeechDetectedError:
        'Aucune voix détectée. Veuillez enregistrer votre voix et réessayer.',
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

      // profile
      conversations: 'Conversaciones',
      profileInfo: 'Información del Perfil',
      username: 'Nombre de Usuario',
      enterUsername: 'Ingrese su nombre de usuario',
      email: 'Correo Electrónico',
      enterEmail: 'Ingrese su correo electrónico',
      languagePreferences: 'Preferencias de Idioma',
      appLanguage: 'Idioma de la Aplicación',
      targetLanguage: 'Idioma Objetivo',
      saveProfileChanges: 'Guardar Cambios del Perfil',
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
      profileUpdateFailed:
        'Error al actualizar el perfil. Por favor, inténtalo de nuevo.',
      passwordUpdated: 'Tu contraseña se ha actualizado con éxito.',
      passwordTooShort: 'La contraseña debe tener al menos 8 caracteres.',
      passwordUpdateError: 'Error al actualizar la contraseña',
      passwordUpdateFailed:
        'Error al actualizar la contraseña. Por favor, inténtalo de nuevo.',
      processingRecording: 'Procesando tu grabación',
      processingRecordingMessage:
        '¡Espera un momento! Consulta la pestaña de Revisión Gramatical para ver los resultados.',
      recordingProcessed: 'Grabación procesada',
      correctionsReady: '¡Tus correcciones están listas!',
      errorSendingAudio: 'Error al enviar el audio',
      unexpectedError: 'Ocurrió un error inesperado.',
      noSpeechDetectedError:
        'No se detectó voz. Por favor, graba tu voz e inténtalo de nuevo.',
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
