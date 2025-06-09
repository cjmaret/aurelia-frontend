export default {
  expo: {
    name: 'Aurelia',
    slug: 'aurelia-frontend',
    owner: 'cjmaret',
    version: '1.0.2',
    orientation: 'portrait',
    icon: './assets/images/aurelia-icon.png',
    scheme: 'com.aureliaai.myapp',
    platforms: ['ios', 'android'],
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.cjmaret.aureliafrontend',
      buildNumber: '3',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSPhotoLibraryUsageDescription:
          'This app needs access to your photo library to let users upload images.',
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
      package: 'com.cjmaret.aureliafrontend',
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
      [
        'expo-splash-screen',
        {
          image: './assets/images/aurelia-splash-screen-icon.png',
          imageWidth: 150,
          resizeMode: 'contain',
          backgroundColor: '#9EE3ED',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      router: {
        origin: false,
      },
      eas: {
        projectId: 'da01ca79-b1e8-465d-bf37-f21ccb7d8bfb',
      },
    },
    runtimeVersion: '1.0.2',
    updates: {
      url: 'https://u.expo.dev/da01ca79-b1e8-465d-bf37-f21ccb7d8bfb',
    },
  },
};
