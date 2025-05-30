import { isExpoGo } from "@/lib/expoHelpers";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Linking, Platform } from "react-native";

const usePermissions = () => {
  const [permissionStatus, setPermissionStatus] = useState({
    location: null as boolean | null,
    backgroundLocation: null as boolean | null,
    storage: null as boolean | null,
  });

  const router = useRouter();

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // Check and request foreground location permissions
        const foregroundLocationPermission =
          await Location.getForegroundPermissionsAsync();
        let foregroundLocationStatus = foregroundLocationPermission.status;

        if (foregroundLocationStatus !== "granted") {
          const { status } = await Location.requestForegroundPermissionsAsync();
          foregroundLocationStatus = status;
        }

        // Check and request background location permissions
        let backgroundLocationStatus = "denied";
        if (foregroundLocationStatus === "granted") {
          const backgroundLocationPermission =
            await Location.getBackgroundPermissionsAsync();
          backgroundLocationStatus = backgroundLocationPermission.status;

          if (backgroundLocationStatus !== "granted") {
            const { status } =
              await Location.requestBackgroundPermissionsAsync();
            backgroundLocationStatus = status;
          }
        }
        // Check and request storage permissions
        let storageStatus = "denied";
        try {
          const storagePermission = await MediaLibrary.getPermissionsAsync();
          storageStatus = storagePermission.status;

          if (storageStatus !== "granted") {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            storageStatus = status;
          }
        } catch (error) {
          console.warn("Error requesting media library permissions:", error);
          storageStatus = "denied";
        }
        // Update permission states
        setPermissionStatus({
          location: foregroundLocationStatus === "granted",
          backgroundLocation: backgroundLocationStatus === "granted",
          storage: storageStatus === "granted",
        });
        // Redirect if any required permissions are missing
        // Handle differently for Expo Go vs development builds
        if (isExpoGo()) {
          // In Expo Go, we only require location permissions since others have limitations
          if (foregroundLocationStatus !== "granted") {
            promptToEnablePermissions();
          }
        } else {
          // In development builds, we require all permissions
          if (
            foregroundLocationStatus !== "granted" ||
            backgroundLocationStatus !== "granted" ||
            storageStatus !== "granted"
          ) {
            // Open app settings to force the user to enable permissions
            promptToEnablePermissions();
          }
        }
      } catch (error) {
        console.error("Error checking permissions:", error);
      }
    };

    checkPermissions();
  }, [router]);

  const promptToEnablePermissions = async () => {
    try {
      // Redirect the user to app settings
      if (Platform.OS === "ios" || Platform.OS === "android") {
        await Linking.openSettings();
      } else {
        console.warn("Platform does not support opening settings.");
      }
    } catch (error) {
      console.error("Error opening app settings:", error);
    }
  };

  return permissionStatus;
};

export default usePermissions;
