import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/types";

const Card = ({
  title,
  value,
  theme,
  onPress = () => {},
  isEditable,
}: {
  title: string;
  value: string;
  theme: Theme;
  onPress?: () => void;
  isEditable?: boolean;
}) => (
  <TouchableOpacity
    style={{
      ...styles.card,
      backgroundColor: theme.primaryColor,
      borderColor: theme.secondaryColor,
    }}
    onPress={onPress}
  >
    <View
      style={{
        ...styles.cardHeader,
        backgroundColor: theme.primaryColor,
      }}
    >
      <Text style={{ ...styles.cardTitle, color: theme.secondaryColor }}>
        {title}
      </Text>
      {isEditable && (
        <TouchableOpacity onPress={onPress} style={styles.editIconContainer}>
          <Ionicons name="pencil-outline" size={20} color={theme.textColor} />
        </TouchableOpacity>
      )}
    </View>
    <View style={styles.cardBody}>
      <Text style={{ ...styles.cardText, color: theme.textColor }}>
        {value}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#666",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  editIconContainer: {
    padding: 5,
  },
  cardBody: {
    padding: 10,
  },
  cardText: {
    fontSize: 15,
    textTransform: "capitalize",
  },
});

export default Card;
