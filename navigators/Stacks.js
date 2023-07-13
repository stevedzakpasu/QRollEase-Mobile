import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Profile from "../screens/Profile";
import Register from "../screens/Register";
import Welcome from "../screens/Welcome";
import Home from "../screens/Home";
import EditScreen from "../screens/EditScreen";

const Stack = createNativeStackNavigator();

export function UnauthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{ animation: "simple_push", headerShown: false }}
    >
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeS" component={Home} />
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
