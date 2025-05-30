import React, { useState, useMemo } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import {
  getCurrentUser,
  getPartnerInfo,
  getRelationship,
  signIn,
} from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useThemeContext } from "@/context/ThemeContext";

const backgroundImageUri =
  "https://i.pinimg.com/564x/01/b2/cf/01b2cf85cc9b992d0c3180f4e77e9a0f.jpg";

const LoginScreen = () => {
  const { setUser, setIsLogged, setRelationship, setPartner, partner } =
    useGlobalContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { theme } = useThemeContext();

  // Memoize theme to prevent unnecessary re-renders
  const memoizedTheme = useMemo(() => theme, [theme]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const session = await signIn(email, password);

      if (typeof session === "string") {
        return Alert.alert("Error", session);
      }

      const result = await getCurrentUser();
      setUser(result as any);
      setIsLogged(true);

      if (result?.relationshipId) {
        const relationshipData = await getRelationship(result?.relationshipId);
        setRelationship(relationshipData as any);

        if (relationshipData?.$id) {
          const parterData = await getPartnerInfo(
            relationshipData.$id,
            result.$id
          );
          setPartner(parterData as any);
        }

        if (!relationshipData) {
          router.replace("/onboarding");
        } else if (relationshipData.wifeId && relationshipData.husbandId) {
          router.replace("/home");
        } else {
          router.replace("/norelationship");
        }
      }
    } catch (error) {
      console.log("Login error:", error);

      Alert.alert("Error", "Failed to sign in. Please try again later.");
    }
  };

  return (
    <ImageBackground
      source={{ uri: backgroundImageUri }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Ionicons
            name="heart"
            size={80}
            color={memoizedTheme.secondaryColor}
          />
          <Text style={{ ...styles.logoText, color: memoizedTheme.textColor }}>
            Duogram
          </Text>
        </View>
        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              {
                color: memoizedTheme.textColor,
                borderColor: memoizedTheme.secondaryColor,
              },
            ]}
            placeholder="Email"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            placeholderTextColor={memoizedTheme.textColor}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={[
              styles.input,
              {
                color: memoizedTheme.textColor,
                borderColor: memoizedTheme.secondaryColor,
              },
            ]}
            placeholder="Password"
            onChangeText={setPassword}
            value={password}
            secureTextEntry
            placeholderTextColor={memoizedTheme.textColor}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text
              style={{
                ...styles.forgotPasswordText,
                color: memoizedTheme.secondaryColor,
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: memoizedTheme.secondaryColor },
            ]}
            onPress={handleLogin}
          >
            <Text
              style={[styles.loginText, { color: memoizedTheme.textColor }]}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
        <Link href="/register" style={styles.registerButton}>
          <Text
            style={[
              styles.registerText,
              { color: memoizedTheme.secondaryColor },
            ]}
          >
            Create an Account
          </Text>
        </Link>
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
  backgroundImage: {
    opacity: 0.8,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
    width: "100%",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 10,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
    borderRadius: 10,
    alignItems: "center",
  },
  input: {
    height: 50,
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: "#40444B",
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    paddingLeft: 15,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginTop: 10,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
