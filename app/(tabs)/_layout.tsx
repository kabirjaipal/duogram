import { useThemeContext } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

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
          borderTopWidth: 0.5,
          paddingBottom: 5,
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
