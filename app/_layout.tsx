import Loading from "@/components/Loading";
import GlobalProvider, { useGlobalContext } from "@/context/GlobalProvider";
import { ThemeProvider } from "@/context/ThemeContext";
import { Stack, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";

SplashScreen.preventAutoHideAsync().catch(() => {});

const RootLayoutInner = () => {
  const { isLogged, loading, user, relationship } = useGlobalContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const getRedirectPath = () => {
      if (!isLogged) {
        return pathname.startsWith("/(auth)") ? null : "/(auth)/login";
      }
      if (isLogged && !relationship) {
        return pathname !== "/onboarding" ? "/onboarding" : null;
      }
      const bothPartnersExist = relationship?.husbandId && relationship?.wifeId;
      if (!bothPartnersExist && pathname !== "/norelationship") {
        return "/norelationship";
      }
      if (bothPartnersExist && pathname === "/onboarding") {
        return "/home";
      }
      return null;
    };

    const redirectPath = getRedirectPath();

    if (redirectPath && pathname !== redirectPath) {
      router.replace(redirectPath);
    }
  }, [isLogged, loading, user, relationship, pathname, router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="norelationship" />
      <Stack.Screen name="no-permission" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <GlobalProvider>
      <ThemeProvider>
        <RootLayoutInner />
      </ThemeProvider>
    </GlobalProvider>
  );
}
