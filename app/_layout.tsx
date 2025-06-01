import GlobalProvider from "@/context/GlobalProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  return (
    <GlobalProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="norelationship" />
          <Stack.Screen name="no-permission" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </ThemeProvider>
    </GlobalProvider>
  );
}
