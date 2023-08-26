import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { HomeStack, ScanningStack, UserProfileStack } from "./Stacks";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { AppContext } from "../context/AppContext";
import { useContext } from "react";

const Tab = createMaterialBottomTabNavigator();

// Define custom tab bar icons as components
const HomeIcon = ({ color, size }) => (
  <MaterialCommunityIcons name="home" color={color} size={size} />
);

const ScannerIcon = ({ color, size }) => (
  <MaterialCommunityIcons name="camera" color={color} size={size} />
);

const UserProfileIcon = ({ color, size }) => (
  <MaterialCommunityIcons name="account" color={color} size={size} />
);

export function BottomTabs() {
  const { userInfo } = useContext(AppContext);

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#328f8a",
      background: "white",
      secondaryContainer: "#e3e8ea",
    },
  };

  return (
    <PaperProvider theme={theme}>
      <Tab.Navigator
        barStyle={{ backgroundColor: theme.colors.background }}
        screenOptions={{
          tabBarInactiveTintColor: "grey",
          tabBarActiveTintColor: "#328f8a",
          tabBarStyle: {
            position: "absolute",
            borderTopColor: "rgba(0, 0, 0, .2)",
          },
          activeBackgroundColor: "transparent",
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <HomeIcon color={focused ? "black" : "grey"} size={24} />
            ),
          }}
        />
        {userInfo.is_staff ? null : (
          <Tab.Screen
            name="Scan"
            component={ScanningStack}
            options={{
              tabBarIcon: ({ focused, color }) => (
                <ScannerIcon color={focused ? "black" : "grey"} size={24} />
              ),
            }}
          />
        )}
        <Tab.Screen
          name="Me"
          component={UserProfileStack}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <UserProfileIcon color={focused ? "black" : "grey"} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
    </PaperProvider>
  );
}
