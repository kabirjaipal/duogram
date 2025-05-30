import React, { useMemo, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  ScrollView,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { useThemeContext } from "@/context/ThemeContext";
import { useGlobalContext } from "@/context/GlobalProvider";
import Loading from "@/components/Loading";
import appConfig from "@/lib/appConfig";

const backgroundImageUri =
  "https://i.pinimg.com/564x/c4/66/b8/c466b8f78feee4a4dde934d82b04cda7.jpg";

const HomeScreen = () => {
  const { theme } = useThemeContext();
  const { user, relationship } = useGlobalContext();
  const hasNavigated = useRef(false);
  const memoizedTheme = useMemo(() => theme, [theme]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user !== null && relationship !== null) {
      setIsLoading(false);
    }
  }, [user, relationship]);

  useEffect(() => {
    if (!isLoading && !hasNavigated.current) {
      if (user) {
        if (!relationship) {
          hasNavigated.current = true;
          return router.push("/onboarding");
        } else if (!relationship?.husbandId || !relationship?.wifeId) {
          hasNavigated.current = true;
          return router.push("/norelationship");
        } else if (relationship) {
          hasNavigated.current = true;
          return router.push("/home");
        }
      }
    }
  }, [isLoading, user, relationship]);

  const handleLoginPress = async () => {
    router.push("/login");
  };

  if (user && isLoading) {
    return <Loading />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <ImageBackground
        source={{ uri: backgroundImageUri }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <FontAwesome6
            name="heart"
            size={80}
            color={memoizedTheme.secondaryColor}
            style={styles.logo}
          />
          <Text
            style={{ ...styles.title, color: memoizedTheme.secondaryColor }}
          >
            {appConfig.appName}
          </Text>
          <Text style={styles.subtitle}>{appConfig.description}</Text>

          <TouchableOpacity
            style={{
              ...styles.button,
              borderColor: memoizedTheme.secondaryColor,
            }}
            onPress={handleLoginPress}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Increased opacity for better text readability
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 48, // Larger font size for emphasis
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 10,
    textAlign: "center", // Center align the title
  },
  subtitle: {
    fontSize: 20, // Larger font size for emphasis
    marginBottom: 10, // Increased margin bottom for separation
    textAlign: "center",
    opacity: 0.9,
    color: "#FFFFFF",
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 20,
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    color: "#FFFFFF",
  },
});
