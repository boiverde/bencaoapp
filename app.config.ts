export default {
  expo: {
  name: "Bênção Match",
  slug: "bencao-match",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "bencaomatch",
  userInterfaceStyle: "automatic",
  platforms: ["ios", "android", "web"],
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#6BBBDD"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.bencaomatch.app",
    buildNumber: "1",
    infoPlist: {
      NSCameraUsageDescription: "Este aplicativo usa a câmera para permitir que você adicione fotos ao seu perfil e verifique sua identidade.",
      NSPhotoLibraryUsageDescription: "Este aplicativo precisa de acesso à sua galeria para que você possa selecionar fotos para seu perfil.",
      NSLocationWhenInUseUsageDescription: "Este aplicativo usa sua localização para encontrar pessoas próximas a você.",
      NSUserTrackingUsageDescription: "Este identificador será usado para entregar anúncios personalizados para você."
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/icon.png",
      backgroundColor: "#6BBBDD"
    },
    package: "com.bencaomatch.app",
    versionCode: 1,
    permissions: [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION"
    ]
  },
  plugins: [
    "expo-router", 
    "expo-font", 
    [
      "expo-notifications",
      {
        icon: "./assets/images/icon.png",
        color: "#6BBBDD",
        sounds: ["./assets/sounds/notification.wav"]
      }
    ],
    
    [
      "expo-camera",
      {
        cameraPermission: "O aplicativo Bênção Match precisa acessar sua câmera para que você possa adicionar fotos ao seu perfil e verificar sua identidade."
      }
    ],
    [
      "expo-image-picker",
      {
        photosPermission: "O aplicativo Bênção Match precisa acessar suas fotos para que você possa selecionar imagens para seu perfil."
      }
    ],
    [
      "expo-location",
      {
        locationWhenInUsePermission: "O aplicativo Bênção Match usa sua localização para encontrar pessoas próximas a você."
      }
    ]
  ],
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true
  },
  extra: {
    router: {
      origin: process.env.EXPO_PUBLIC_WEBSITE_URL || "https://bencaomatch.com"
    },
    eas: {
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID || "your-eas-project-id"
    },
    apiUrl: process.env.EXPO_PUBLIC_API_URL,
    apiKey: process.env.EXPO_PUBLIC_API_KEY
  }
  }
};