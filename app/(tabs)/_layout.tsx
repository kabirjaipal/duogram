import React from "react";
import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "@/context/ThemeContext";

// Memoized TabIcon component to optimize rendering
const TabIcon: React.FC<{ name: any; color: string; size: number }> =
  React.memo(({ name, color, size }) => (
    <Ionicons name={name} color={color} size={size} />
  ));

const TabsLayout: React.FC = React.memo(() => {
  const { theme } = useThemeContext();

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: theme.secondaryColor,
        tabBarStyle: {
          backgroundColor: theme.primaryColor,
          borderTopColor: theme.secondaryColor,
          borderTopWidth: 1,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          textTransform: "uppercase",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="relationship"
        options={{
          headerShown: false,
          tabBarLabel: "Relationship",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          headerShown: false,
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="chatbubble-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
});

export default TabsLayout;
