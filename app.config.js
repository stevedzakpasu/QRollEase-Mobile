import "dotenv/config";

module.exports = {
  expo: {
    name: "QRollEase",
    slug: "QRollEase-Mobile",
    version: "1.0.1",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.codewithsteve.QRollEaseMobile",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "b028956a-09b2-454f-bb1d-4bd0efd22dfa",
      },
    },
    plugins: [
      [
        "expo-barcode-scanner",
        {
          cameraPermission: "Allow QRollEase to access camera.",
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow QRollEase to use your location.",
        },
      ],
    ],
  },
};
