import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { HomeStack, UserProfileStack } from "./Stacks";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const Tab = createBottomTabNavigator();

export function BottomTabs() {
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
