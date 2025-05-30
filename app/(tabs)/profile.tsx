import React, { useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { signOut } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeContext } from "@/context/ThemeContext";
import ThemeSelector from "@/components/ThemeSelector";
import { Theme } from "@/types";

const settings = [
  { label: "Notification Settings" },
  { label: "Privacy Settings" },
  { label: "Account Details" },
  { label: "Appearance" },
  { label: "Language" },
  { label: "Security" },
];

const Profile = () => {
  const { user, setIsLogged, setUser, setRelationship, setPartner } =
    useGlobalContext();
  const { theme } = useThemeContext();

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      setIsLogged(false);
      setUser(null);
      setRelationship(null);
      setPartner(null);
      router.replace("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }, [setIsLogged, setUser, setRelationship, setPartner]);

  const userInfo = useMemo(
    () => (
      <>
        <Image source={{ uri: user?.avatar }} style={styles.avatar} />
        <Text style={[styles.username, { color: theme.textColor }]}>
          {user?.username}
        </Text>
        <Text style={styles.email}>{user?.email}</Text>
      </>
    ),
    [user, theme]
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.primaryColor }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>{userInfo}</View>

        <TouchableOpacity
          style={[
            styles.button,
            styles.logoutButton,
            { borderColor: theme.secondaryColor },
          ]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText, { color: theme.textColor }]}>
            Logout
          </Text>
        </TouchableOpacity>

        <ThemeSelector />

        <View style={styles.settingsContainer}>
          {settings.map((setting, index) => (
            <SettingItem key={index} label={setting.label} theme={theme} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const SettingItem = React.memo(
  ({ label, theme }: { label: string; theme: Theme }) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderColor: theme.secondaryColor }]}
      onPress={() => console.log(`Clicked ${label}`)}
    >
      <Text style={[styles.settingLabel, { color: theme.textColor }]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
);

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#8e9297",
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginVertical: 8,
    width: "100%",
    alignItems: "center",
  },
  logoutButton: {
    marginBottom: 20,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  settingsContainer: {
    marginTop: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  settingLabel: {
    fontSize: 16,
  },
});
