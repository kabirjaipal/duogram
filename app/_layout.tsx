import Loading from "@/components/Loading";
import GlobalProvider, { useGlobalContext } from "@/context/GlobalProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { setupConsoleFilters, showExpoGoLimitationsWarning } from "@/lib/expoHelpers";
import { Stack, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";

SplashScreen.preventAutoHideAsync(); // Prevent splash screen from auto-hiding

// Set up console filters to reduce clutter from known Expo Go warnings
setupConsoleFilters();

const RootLayout = () => {
  // Show one-time Expo Go limitations warning
  useEffect(() => {
    // Show the warning after a short delay to allow the app to initialize
    const timer = setTimeout(() => {
      showExpoGoLimitationsWarning();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  const { isLogged, loading, user, relationship } = useGlobalContext?.() || {};
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    // If not logged in, redirect to login
    if (!isLogged) {
      if (!pathname.startsWith("/(auth)")) router.replace("/(auth)/login");
      return;
    }
    // If logged in but no relationship, go to onboarding
    if (isLogged && !relationship) {
      if (pathname !== "/onboarding") router.replace("/onboarding");
      return;
    }
    // If relationship exists but not both partners joined, go to norelationship
    if (
      isLogged &&
      relationship &&
      (!relationship.husbandId || !relationship.wifeId)
    ) {
      if (pathname !== "/norelationship") router.replace("/norelationship");
      return;
    }
    // If everything is fine, allow access to tabs
    if (
      isLogged &&
      relationship &&
      relationship.husbandId &&
      relationship.wifeId &&
      pathname === "/onboarding"
    ) {
      router.replace("/home");
    }
  }, [isLogged, loading, user, relationship, pathname, router]);

  // Show loading while checking auth state
  if (loading) return <Loading />;

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="norelationship" options={{ headerShown: false }} />
        <Stack.Screen name="no-permission" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
};

const AppRoot = () => (
  <ThemeProvider>
    <GlobalProvider>
      <RootLayout />
    </GlobalProvider>
  </ThemeProvider>
);

export default AppRoot;
