import { NavigationContainer } from "@react-navigation/native";
import { BottomTabs } from "./navigators/BottomTabs";
import { useCallback, useEffect, useState } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { UnauthenticatedStack } from "./navigators/Stacks";
import { save, getValueFor } from "./hooks/SecureStore";
import { AppContext } from "./context/AppContext";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [token, setToken] = useState(null);
  const options = {
    method: "POST",
    url: "http://qrollease-api-112d897b35ef.herokuapp.com/api/login/access-token",
    headers: {
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      grant_type: "",
      username: email,
      password: password,
      scope: "",
      client_id: "",
      client_secret: "",
    },
  };
  useEffect(() => {
    async function getAppReady() {
      try {
        await getValueFor("access_token").then((access_token) => {
          setToken(access_token);
        });
        await getValueFor("email").then((email) => {
          setEmail(email);
        });
        await getValueFor("password").then((password) => {
          setPassword(password);
        });
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          bold: require("./assets/fonts/Montserrat-Bold.ttf"),
          light: require("./assets/fonts/Montserrat-Light.ttf"),
          medium: require("./assets/fonts/Montserrat-Medium.ttf"),
          regular: require("./assets/fonts/Montserrat-Regular.ttf"),
          semibold: require("./assets/fonts/Montserrat-SemiBold.ttf"),
          thin: require("./assets/fonts/Montserrat-Thin.ttf"),
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    getAppReady();
  }, []);

  const updateAccessToken = useCallback(async () => {
    try {
      const response = await axios(options);
      save("access_token", JSON.stringify(response.data));
      setToken(JSON.stringify(response.data));
    } catch (error) {
      console.log(error);
    }
  }, []); // Empty dependency array indicates that the callback doesn't depend on any external variables

  useEffect(() => {
    if (email) updateAccessToken();
  }, [updateAccessToken, email]);

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
      <AppContext.Provider value={{ token, setToken, updateAccessToken }}>
        {!token ? <UnauthenticatedStack /> : <BottomTabs />}
      </AppContext.Provider>
    </NavigationContainer>
  );
}
