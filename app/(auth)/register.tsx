import React, { useState } from "react";
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
import { createUser } from "@/lib/appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useThemeContext } from "@/context/ThemeContext";
import { Picker } from "@react-native-picker/picker"; // Import Picker from package

const backgroundImageUri =
  "https://i.pinimg.com/564x/01/b2/cf/01b2cf85cc9b992d0c3180f4e77e9a0f.jpg";

const RegisterScreen = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const { theme } = useThemeContext();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "", // New field for gender
  });

  const handleRegister = async () => {
    const { username, email, password, gender } = formData;

    if (!username || !email || !password || !gender) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const result = await createUser(email, password, username, gender);

      if (!result) {
        setUser(null);
        setIsLogged(false);
        router.replace("/login");
      } else {
        setUser(result as any);
        setIsLogged(true);
        router.replace("/onboarding");
      }
    } catch (error) {
      console.log("Error registering:", error);
      Alert.alert("Error", "Failed to register. Please try again later.");
    }
  };

  const handleChangeText = (key: string, value: string) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  return (
    <ImageBackground
      source={{ uri: backgroundImageUri }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Ionicons name="heart" size={80} color={theme.secondaryColor} />
          <Text style={{ ...styles.logoText, color: theme.textColor }}>
            Duogram
          </Text>
        </View>
        <View style={styles.form}>
          <TextInput
            style={[
              styles.input,
              {
                color: theme.textColor,
                borderColor: theme.secondaryColor,
              },
            ]}
            placeholder="Username"
            onChangeText={(text) => handleChangeText("username", text)}
            value={formData.username}
            placeholderTextColor={theme.textColor}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={[
              styles.input,
              {
                color: theme.textColor,
                borderColor: theme.secondaryColor,
              },
            ]}
            placeholder="Email"
            onChangeText={(text) => handleChangeText("email", text)}
            value={formData.email}
            keyboardType="email-address"
            placeholderTextColor={theme.textColor}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextInput
            style={[
              styles.input,
              {
                color: theme.textColor,
                borderColor: theme.secondaryColor,
              },
            ]}
            placeholder="Password"
            onChangeText={(text) => handleChangeText("password", text)}
            value={formData.password}
            secureTextEntry
            placeholderTextColor={theme.textColor}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View
            style={[
              styles.input,
              styles.pickerContainer,
              {
                borderColor: theme.secondaryColor,
              },
            ]}
          >
            <Picker
              selectedValue={formData.gender}
              style={{
                color: theme.textColor,
                borderColor: theme.secondaryColor,
              }}
              onValueChange={(itemValue) =>
                handleChangeText("gender", itemValue.toString())
              }
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
            </Picker>
          </View>
          <TouchableOpacity
            style={[
              styles.registerButton,
              { backgroundColor: theme.secondaryColor },
            ]}
            onPress={handleRegister}
          >
            <Text style={[styles.registerText, { color: theme.textColor }]}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
        <Link href={"/login"} style={styles.loginLink}>
          <Text style={[styles.loginText, { color: theme.secondaryColor }]}>
            Already have an account? Login
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
    height: 60,
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: "#40444B",
    color: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    fontSize: 16,
    paddingLeft: 15,
  },
  pickerContainer: {
    marginBottom: 10,
  },
  registerButton: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  loginLink: {
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
