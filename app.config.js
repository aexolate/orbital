export default {
  expo: {
    name: 'reachliao',
    slug: 'reachliao',
    version: '1.1.0',
    orientation: 'portrait',
    icon: './assets/icon2.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash2.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      userInterfaceStyle: 'light',
      supportsTablet: true,
    },
    android: {
      userInterfaceStyle: 'light',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon2.png',
        backgroundColor: '#FFFFFF',
      },
      package: 'com.reachliao',
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
      permissions: [
        'ACCESS_COARSE_LOCATION',
        'ACCESS_FINE_LOCATION',
        'ACCESS_BACKGROUND_LOCATION',
        'FOREGROUND_SERVICE',
        'VIBRATE',
      ],
    },
    web: {
      favicon: './assets/favicon.png',
    },
  },
};
