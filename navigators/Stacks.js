import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Profile from "../screens/Profile";
import Register from "../screens/Register";
import Welcome from "../screens/Welcome";
import Home from "../screens/Home";
import EditScreen from "../screens/EditScreen";
import CourseDetails from "../screens/CourseDetails";
import LectureDetails from "../screens/LectureDetails";
import AdInformation from "../screens/AdInformation";
import VerifyEmail from "../screens/VerifyEmail";
import ResetPassword from "../screens/ResetPassword";

const Stack = createNativeStackNavigator();

export function UnauthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{ animation: "simple_push", headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
}
export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Course" component={Home} />
      <Stack.Screen name="CourseDetails" component={CourseDetails} />
      <Stack.Screen name="LectureDetails" component={LectureDetails} />
    </Stack.Navigator>
  );
}
export function UserProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditScreen" component={EditScreen} />
    </Stack.Navigator>
  );
}
export function UnverifiedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
      <Stack.Screen name="AdInformation" component={AdInformation} />
    </Stack.Navigator>
  );
}
