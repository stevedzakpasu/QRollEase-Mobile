import { NavigationContainer } from "@react-navigation/native";
import { BottomTabs } from "./navigators/BottomTabs";
import { useCallback, useEffect, useState } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  useEffect(() => {
    async function loadFonts() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          bold: require("./assets/fonts/Montserrat-Bold.ttf"),
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    loadFonts();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer onReady={onLayoutRootView}>
      <BottomTabs />
    </NavigationContainer>
  );
}
