import { useGlobalContext } from "@/context/GlobalProvider";
import { useThemeContext } from "@/context/ThemeContext";
import appConfig from "@/lib/appConfig";
import {
    createRelationship,
    joinRelationship
} from "@/lib/appwrite";
import { generateDefaultCode } from "@/lib/functions";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    Alert,
    ImageBackground,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const backgroundImageUri =
  "https://i.pinimg.com/564x/01/b2/cf/01b2cf85cc9b992d0c3180f4e77e9a0f.jpg";

const OnBoardingScreen = () => {
  const { theme } = useThemeContext();
  const { relationship } = useGlobalContext();
  const [connectionCode, setConnectionCode] = useState("");
  const [isCreatingRelationship, setIsCreatingRelationship] = useState(false);
  const [initialCode, setInitialCode] = useState("");

  const handleAction = () => {
    if (isCreatingRelationship) {
      handleCreateRelationship();
    } else {
      handleJoinRelationship();
    }
  };

  useEffect(() => {
    if (relationship && (!relationship.husbandId || !relationship.wifeId)) {
      router.replace("/norelationship");
    }
  }, [relationship]);

  useEffect(() => {
    if (isCreatingRelationship) {
      if (!initialCode) {
        const defaultCode = generateDefaultCode();
        setConnectionCode(defaultCode);
        setInitialCode(defaultCode);
      } else {
        setConnectionCode(initialCode);
      }
    } else {
      setConnectionCode("");
    }
  }, [isCreatingRelationship]);

  const handleJoinRelationship = async () => {
    const codePattern = /^[A-Za-z0-9@#&*_+-]{8,}$/;
    if (!codePattern.test(connectionCode)) {
      Alert.alert(
        "Invalid Connection Code",
        "Connection code must be at least 8 characters long and can contain letters, numbers, and special characters (@ # & * _ + -)"
      );
      return;
    }

    const joinedRelationship = await joinRelationship(connectionCode);

    if (joinedRelationship) {
      Alert.alert("Success", "Relationship joined successfully.");
      router.replace("/home");
    } else {
      Alert.alert("Error", "Failed to join relationship. Please try again.");
    }
  };

  const handleCreateRelationship = async () => {
    const createdRelationship = await createRelationship(connectionCode);

    if (createdRelationship) {
      setConnectionCode("");

      Alert.alert(
        "Success",
        "Relationship created successfully. You can now share the connection code with your partner."
      );

      router.replace("/norelationship");
    } else {
      Alert.alert("Error", "Failed to create relationship. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flexGrow: 1 }}>
      <ImageBackground
        source={{ uri: backgroundImageUri }}
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <StatusBar style="dark" />
        <View style={styles.container}>
          <Text style={{ ...styles.header, color: theme.textColor }}>
            Welcome to {appConfig.appName}
          </Text>
          <Text style={{ ...styles.subHeader, color: theme.textColor }}>
            {isCreatingRelationship
              ? "Create Relationship"
              : "Join Relationship"}
          </Text>
          <TextInput
            style={{
              ...styles.input,
              borderColor: theme.secondaryColor,
              color: theme.textColor,
            }}
            placeholder={"Enter connection code"}
            value={connectionCode}
            onChangeText={setConnectionCode}
            placeholderTextColor={theme.textColor}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isCreatingRelationship}
          />
          <TouchableOpacity
            style={{
              ...styles.button,
              backgroundColor: theme.secondaryColor,
              borderColor: theme.secondaryColor,
            }}
            onPress={handleAction}
            disabled={isCreatingRelationship && !connectionCode}
          >
            <Text style={{ ...styles.buttonText, color: theme.textColor }}>
              {isCreatingRelationship ? "Create" : "Join"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsCreatingRelationship((prev) => !prev)}
          >
            <Text
              style={{
                ...styles.switchButtonText,
                color: theme.secondaryColor,
              }}
            >
              {isCreatingRelationship
                ? "Join an existing relationship"
                : "Create a new relationship"}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    opacity: 0.8,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 30,
    width: "100%",
    borderRadius: 16,
    paddingVertical: 32,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    textTransform: "uppercase",
  },
  subHeader: {
    fontSize: 20,
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 20,
    fontSize: 18,
    borderRadius: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 100,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  switchButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default OnBoardingScreen;
