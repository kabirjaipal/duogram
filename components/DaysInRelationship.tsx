import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { calculateRelationshipDays } from "@/lib/functions";
import { useThemeContext } from "@/context/ThemeContext";
import { useGlobalContext } from "@/context/GlobalProvider";

const DaysInRelationship: React.FC = () => {
  const { theme } = useThemeContext();
  const { relationship } = useGlobalContext();

  const days = calculateRelationshipDays(relationship?.relationshipDate!);

  return (
    <View style={[styles.container, { backgroundColor: theme.secondaryColor }]}>
      <Text style={[styles.daysText, { color: theme.tintColor }]}>{days}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 45,
    left: 10,
    alignItems: "flex-end",
    zIndex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  daysText: {
    fontSize: 16,
  },
});

export default DaysInRelationship;
