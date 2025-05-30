import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Theme } from "@/types";

const Section = ({
  title,
  children,
  theme,
}: {
  title: string;
  children: React.ReactNode;
  theme: Theme;
}) => (
  <View>
    <Text style={{ ...styles.sectionTitle, color: theme.secondaryColor }}>
      {title}
    </Text>
    <View style={styles.cardRow}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardRow: {
    marginBottom: 15,
  },
});

export default Section;
