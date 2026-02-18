const IS_DEV =
  process.env.EXPO_PUBLIC_ENV === 'development' ||
  process.env.EXPO_PUBLIC_ENV === 'local';

export default {
  expo: {
    name: IS_DEV ? 'Aurelia (Dev)' : 'Aurelia',
    slug: 'aurelia-frontend',
    owner: 'cjmaret',
    version: '2.0.0',
    orientation: 'portrait',
    icon: './assets/images/aurelia-icon.png',
    scheme: IS_DEV ? 'aureliadev' : 'aurelia',
    platforms: ['ios', 'android'],
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_DEV
        ? 'com.cjmaret.aureliafrontend.dev'
        : 'com.cjmaret.aureliafrontend',
      buildNumber: '50',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSMicrophoneUsageDescription:
          'This app uses the microphone to record audio as part of voice interaction features.',
        NSSpeechRecognitionUsageDescription:
          'This app uses speech recognition to improve your experience with voice commands.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: IS_DEV
        ? 'com.cjmaret.aureliafrontend.dev'
        : 'com.cjmaret.aureliafrontend',
      versionCode: 50,
      versionName: '2.0.0',
      permissions: [
        'android.permission.INTERNET',
        'android.permission.RECORD_AUDIO',
      ],
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    splash: {
      image: './assets/images/aurelia-splash-screen-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#9EE3ED',
    },
    plugins: [
      'expo-router',
      'expo-audio',
      [
        'expo-splash-screen',
        {
          image: './assets/images/aurelia-splash-screen-icon.png',
          imageWidth: 150,
          resizeMode: 'contain',
          backgroundColor: '#9EE3ED',
        },
      ],
      'expo-font',
      'expo-secure-store',
      'expo-web-browser',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV,
      router: {
        origin: false,
      },
      eas: {
        projectId: 'da01ca79-b1e8-465d-bf37-f21ccb7d8bfb',
      },
    },
    runtimeVersion: '2.0.0',
    updates: {
      url: 'https://u.expo.dev/da01ca79-b1e8-465d-bf37-f21ccb7d8bfb',
    },
  },
};
