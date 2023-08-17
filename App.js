import { useCallback, useEffect, useState, useMemo } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { UnauthenticatedStack, UnverifiedStack } from "./navigators/Stacks";
import { BottomTabs } from "./navigators/BottomTabs";
import { save, getValueFor } from "./hooks/SecureStore";
import { saveLocally, getLocalValueFor } from "./hooks/LocalStorage";
import { AppContext } from "./context/AppContext";
import Loading from "./screens/Loading";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [lecturesData, setLecturesData] = useState({});
  const [studentInfo, setStudentInfo] = useState({
    student_id: "Loading",
    programme: "Loading",
  });

  const [staffInfo, setStaffInfo] = useState({
    staff_id: "Loading",
    department: "Loading",
  });
  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      updateAccessToken,
      userInfo,
      setUserInfo,
      lecturesData,
      setLecturesData,
      studentInfo,
      setStudentInfo,
      staffInfo,
      setStaffInfo,
    }),
    [
      token,
      setToken,
      updateAccessToken,
      userInfo,
      setUserInfo,
      lecturesData,
      setLecturesData,
    ]
  );

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

  const options2 = {
    method: "GET",
    url: "https://qrollease-api-112d897b35ef.herokuapp.com/api/users/me",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${JSON.parse(token)} `,
    },
  };
  useEffect(() => {
    async function getAppReady() {
      try {
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

  useEffect(() => {
    console.log(lecturesData);
  });

  useEffect(async () => {
    await getValueFor("access_token").then((access_token) => {
      setToken(access_token);
    });
    await getValueFor("email").then((email) => {
      setEmail(email);
    });
    await getValueFor("password").then((password) => {
      setPassword(password);
    });
    await getLocalValueFor("user_info").then((user_info) => {
      setUserInfo(JSON.parse(user_info));
    });
    await updateAccessToken();
    await updateUserInfo();
  }, []);

  const updateAccessToken = useCallback(async () => {
    if (email && password) {
      try {
        const response = await axios(options);
        save("access_token", JSON.stringify(response.data.access_token));
        setToken(JSON.stringify(response.data.access_token));
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  const updateUserInfo = useCallback(async () => {
    if (access_token) {
      {
        try {
          const response = await axios(options2);
          saveLocally("user_info", JSON.stringify(response.data));
          setUserInfo(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    }
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
      <AppContext.Provider value={contextValue}>
        {token && !userInfo && <Loading />}

        {token && userInfo && userInfo.is_verified && <BottomTabs />}

        {token && userInfo && !userInfo.is_verified && <UnverifiedStack />}

        {!token && <UnauthenticatedStack />}
      </AppContext.Provider>
    </NavigationContainer>
  );
}
