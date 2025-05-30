import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Clipboard,
} from "react-native";
import React from "react";
import { useThemeContext } from "@/context/ThemeContext";
import { useGlobalContext } from "@/context/GlobalProvider";
import { signOut } from "@/lib/appwrite";
import { router } from "expo-router";

const backgroundImageUri =
  "https://i.pinimg.com/564x/80/6a/2b/806a2bcfd79f5e2326225ff17ba8226f.jpg"; // Example Pinterest image URL

const NoRelationship = () => {
  const { theme } = useThemeContext();
  const { relationship } = useGlobalContext();

  return (
    <ImageBackground
      source={{ uri: backgroundImageUri }}
      style={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <Text style={[styles.title, { color: theme.secondaryColor }]}>
          No Relationship Found
        </Text>
        <Text style={{ ...styles.description, color: theme.textColor }}>
          It seems like you are not in a relationship yet. Invite your partner
          to start using the app together.
        </Text>
        <View style={{ gap: 15 }}>
          <TouchableOpacity
            style={{ ...styles.button, borderColor: theme.secondaryColor }}
            onPress={() => {
              Clipboard.setString(String(relationship?.connectionCode));
              Alert.alert("Clipboard", "Connection code copied to clipboard");
            }}
          >
            <Text style={{ ...styles.buttonText, color: theme.textColor }}>
              {relationship?.connectionCode}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.button, borderColor: theme.secondaryColor }}
            onPress={() => {
              try {
                signOut();
                return router.replace("/login");
              } catch (error) {}
            }}
          >
            <Text style={{ ...styles.buttonText, color: theme.textColor }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default NoRelationship;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent overlay for better text readability
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    textTransform: "uppercase",
  },
  description: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: "center",
    textTransform: "capitalize",
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    color: "#333",
  },
});
