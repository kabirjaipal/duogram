import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useThemeContext } from "@/context/ThemeContext";
import themes from "@/lib/themes";
import { Picker } from "@react-native-picker/picker";

const ThemeSelector = () => {
  const { theme, switchTheme } = useThemeContext();

  const [selectedTheme, setSelectedTheme] = useState(Object.keys(themes)[0]);

  const handleThemeChange = (themeName: keyof typeof themes) => {
    switchTheme(themeName);
    setSelectedTheme(themeName);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          ...styles.pickerContainer,
          borderColor: theme.secondaryColor,
        }}
      >
        <Picker
          selectedValue={selectedTheme}
          style={{
            color: theme.textColor,
            backgroundColor: theme.primaryColor,
          }}
          onValueChange={(itemValue: string) =>
            handleThemeChange(itemValue as keyof typeof themes)
          }
        >
          {Object.keys(themes).map((themeName) => (
            <Picker.Item
              key={themeName}
              label={themeName.charAt(0).toUpperCase() + themeName.slice(1)}
              value={themeName}
              style={{
                color: themes[themeName as keyof typeof themes].secondaryColor,
                backgroundColor: theme.primaryColor,
              }}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  pickerContainer: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default ThemeSelector;
