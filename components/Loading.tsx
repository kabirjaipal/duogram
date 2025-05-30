import { ActivityIndicator, StyleSheet, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeContext } from "@/context/ThemeContext";

const Loading = () => {
  const { theme } = useThemeContext();
  return (
    <SafeAreaView
      style={{
        ...styles.loadingContainer,
        backgroundColor: theme.primaryColor,
      }}
    >
      <ActivityIndicator size="large" color={theme.secondaryColor} />
      <Text style={{ ...styles.loadingText, color: theme.textColor }}>
        Loading...
      </Text>
    </SafeAreaView>
  );
};

export default Loading;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});
