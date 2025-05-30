import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { User, Theme } from "@/types";

interface EmptyBannerProps {
  user: User | null;
  partner: User | null;
  theme: Theme;
}

const EmptyBanner: React.FC<EmptyBannerProps> = ({ user, partner, theme }) => {
  const currentUser = user?.username;
  const oppositeAvatar =
    currentUser === user?.username ? partner?.avatar : user?.avatar;

  return (
    <View style={{ ...styles.emptyBanner }}>
      <View style={styles.emptyBannerContent}>
        <Image
          source={{ uri: oppositeAvatar }}
          style={styles.emptyBannerAvatar}
        />
        <Text style={{ ...styles.emptyBannerText, color: theme.textColor }}>
          Start a chat with {partner?.username}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyBanner: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  emptyBannerContent: {
    alignItems: "center",
    gap: 10,
  },
  emptyBannerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  emptyBannerText: {
    fontSize: 16,
    color: "#333",
  },
});

export default EmptyBanner;
