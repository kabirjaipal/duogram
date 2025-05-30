import { useThemeContext } from "@/context/ThemeContext";
import appConfig from "@/lib/appConfig";
import { isExpoGo } from "@/lib/expoHelpers";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const PermissionsScreen: React.FC = () => {
  const { theme } = useThemeContext();
  const [permissionsGranted, setPermissionsGranted] = useState({
    location: false,
    storage: false,
  });
  const router = useRouter();

  const checkAllPermissions = (updatedPermissions: {
    location: boolean;
    storage: boolean;
  }) => {
    if (isExpoGo()) {
      if (updatedPermissions.location) {
        router.push("/home");
      }
    } else {
      if (updatedPermissions.location && updatedPermissions.storage) {
        router.push("/home");
      }
    }
  };

  const handleLocationPermission = async () => {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    const updatedPermissions = {
      ...permissionsGranted,
      location: status === "granted",
    };
    setPermissionsGranted(updatedPermissions);
    if (status !== "granted") {
      Alert.alert(
        "Location Permission Denied",
        "Please grant location permission from settings to proceed."
      );
    }
    checkAllPermissions(updatedPermissions);
  };

  const handleStoragePermission = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      let updatedPermissions = {
        ...permissionsGranted,
        storage: status === "granted",
      };
      if (status !== "granted") {
        Alert.alert(
          "Storage Permission Denied",
          "Please grant storage permission from settings to proceed."
        );
      }
      setPermissionsGranted(updatedPermissions);
      checkAllPermissions(updatedPermissions);
    } catch (error) {
      console.warn("Error requesting storage permissions:", error);
      const updatedPermissions = {
        ...permissionsGranted,
        storage: true,
      };
      setPermissionsGranted(updatedPermissions);
      checkAllPermissions(updatedPermissions);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/564x/2c/39/de/2c39de82f16c73cdffab06b76a333d7f.jpg",
      }}
      style={[styles.background, { backgroundColor: theme.primaryColor }]}
    >
      <View style={styles.container}>
        <Text style={[styles.appName, { color: theme.secondaryColor }]}>
          {appConfig.appName}
        </Text>
        <Text style={[styles.text, { color: theme.textColor }]}>
          We need the following permissions to proceed.
        </Text>
        <TouchableOpacity
          style={[styles.button, { borderColor: theme.secondaryColor }]}
          onPress={handleLocationPermission}
        >
          <Text style={[styles.buttonText, { color: theme.textColor }]}>
            Grant Location Permission
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { borderColor: theme.secondaryColor }]}
          onPress={handleStoragePermission}
        >
          <Text style={[styles.buttonText, { color: theme.textColor }]}>
            Grant Storage Permission
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  appName: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    marginVertical: 10,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    width: "100%",
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

export default PermissionsScreen;
