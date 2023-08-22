import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { HomeStack, ScanningStack, UserProfileStack } from "./Stacks";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";
const Tab = createBottomTabNavigator();

export function BottomTabs() {
  const { userInfo } = useContext(AppContext);
  return (
    <Tab.Navigator
      // activeColor="#000000"
      // inactiveColor="#ffffff"
      // barStyle={{ backgroundColor: "#40cbc3" }}
      screenOptions={{
        tabBarStyle: { position: "absolute", backgroundColor: "white" },
        tabBarActiveTintColor: "#40cbc3",
        tabBarInactiveTintColor: "#808080",
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      {!userInfo.is_staff ? (
        <Tab.Screen
          name="Scanner"
          component={ScanningStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="camera" color={color} size={size} />
            ),
          }}
        />
      ) : null}
      <Tab.Screen
        name="User Profile"
        component={UserProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
