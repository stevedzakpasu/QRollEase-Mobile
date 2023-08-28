import { useCallback, useEffect, useState, useMemo } from "react";
import { View } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { NavigationContainer } from "@react-navigation/native";
import { UnauthenticatedStack, UnverifiedStack } from "./navigators/Stacks";
import { BottomTabs } from "./navigators/BottomTabs";
import { save, getValueFor } from "./hooks/SecureStore";
import { saveLocally, getLocalValueFor } from "./hooks/LocalStorage";
import { AppContext } from "./context/AppContext";
import Loading from "./screens/Loading";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
export default function App() {
  const [attendance, setAttendance] = useState([]);
  const [appIsReady, setAppIsReady] = useState(false);
  const [location, setLocation] = useState(null);
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
      location,
      setLocation,
      attendance,
      setAttendance,
    }),
    [
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
      location,
      setLocation,
      attendance,
      setAttendance,
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
    const fetchData = async () => {
      const access_token = await getValueFor("access_token");
      const email = await getValueFor("email");
      const password = await getValueFor("password");
      const user_info = await getLocalValueFor("user_info");

      setToken(access_token);
      setEmail(email);
      setPassword(password);
      setUserInfo(JSON.parse(user_info));

      await updateAccessToken();
      await updateUserInfo();
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const lastKnownLocation = await Location.getLastKnownPositionAsync();
      setLocation(lastKnownLocation);

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 100,
      });
      setLocation(currentLocation);
    };

    getLocation();
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
    if (token) {
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
    <View style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer onReady={onLayoutRootView}>
        <AppContext.Provider value={contextValue}>
          {token && !userInfo && <Loading />}

          {token && userInfo && userInfo.is_verified && <BottomTabs />}

          {token && userInfo && !userInfo.is_verified && <UnverifiedStack />}

          {!token && <UnauthenticatedStack />}
        </AppContext.Provider>
      </NavigationContainer>
    </View>
  );
}
