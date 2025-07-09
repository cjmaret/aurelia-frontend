export default {
  expo: {
    name: 'Aurelia',
    slug: 'aurelia-frontend',
    owner: 'cjmaret',
    version: '1.0.5',
    orientation: 'portrait',
    icon: './assets/images/aurelia-icon.png',
    scheme: 'com.aureliaai.myapp',
    platforms: ['ios', 'android'],
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.cjmaret.aureliafrontend',
      buildNumber: '4',
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
      versionCode: 20,
      versionName: '1.0.5',
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
      EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV,
      router: {
        origin: false,
      },
      eas: {
        projectId: 'da01ca79-b1e8-465d-bf37-f21ccb7d8bfb',
      },
    },
    runtimeVersion: '1.0.5',
    updates: {
      url: 'https://u.expo.dev/da01ca79-b1e8-465d-bf37-f21ccb7d8bfb',
    },
  },
};
