import { useThemeContext } from "@/context/ThemeContext";
import { UserDataInterface } from "@/types";
import {
  Entypo,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import * as Battery from "expo-battery";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";

interface Props {
  userData: UserDataInterface;
  selectedUsername: string;
}

const HomeInfo: React.FC<Props> = ({ userData, selectedUsername }) => {
  const { theme } = useThemeContext();
  const {
    deviceInfo,
    batteryLevel,
    networkInfo,
    currentLocation,
    batteryState,
  } = userData;

  const [showTooltip, setShowTooltip] = useState(false);

  if (!batteryState) return null;

  let batteryIcon = "battery-medium";
  let batteryColor = theme.secondaryColor;

  if (batteryState === Battery.BatteryState.FULL) {
    batteryIcon = "battery";
  } else if (batteryState === Battery.BatteryState.CHARGING) {
    batteryIcon = "battery-charging";
  } else if (batteryLevel * 100 < 20) {
    batteryColor = "#ff4c4c";
    batteryIcon = "battery-alert";
  }

  return (
    <View
      style={[
        styles.infoContainer,
        {
          backgroundColor: theme.primaryColor,
          shadowColor: theme.textColor,
        },
      ]}
    >
      {/* Username */}
      <View style={styles.card}>
        <FontAwesome5 name="user-alt" size={20} color={theme.secondaryColor} />
        <Text style={[styles.infoText, { color: theme.textColor }]}>
          {selectedUsername}
        </Text>
      </View>

      {/* Device, Network, Battery */}
      <View style={[styles.card, styles.multiItem]}>
        <TouchableWithoutFeedback
          onPressIn={() => setShowTooltip(true)}
          onPressOut={() => setShowTooltip(false)}
        >
          <View style={styles.infoItem}>
            <FontAwesome5
              name="mobile-alt"
              size={20}
              color={theme.secondaryColor}
            />
            <Text
              style={[styles.infoText, styles.truncatedText, { color: theme.textColor }]}
              numberOfLines={1}
            >
              {deviceInfo.name}
            </Text>
            {showTooltip && (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>{deviceInfo.name}</Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.infoItem}>
          <MaterialIcons name="wifi" size={20} color={theme.secondaryColor} />
          <Text style={[styles.infoText, { color: theme.textColor }]}>
            {networkInfo || "N/A"}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <MaterialCommunityIcons
            name={batteryIcon as any}
            size={20}
            color={batteryColor}
          />
          <Text style={[styles.infoText, { color: theme.textColor }]}>
            {(batteryLevel * 100).toFixed(0)}%
          </Text>
        </View>
      </View>

      {/* Location */}
      <View style={styles.card}>
        <Entypo name="location-pin" size={20} color={theme.secondaryColor} />
        <Text
          style={[styles.infoText, { color: theme.textColor, flex: 1 }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {currentLocation}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    padding: 16,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginBottom: 12,
  },
  multiItem: {
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    minWidth: 0,
  },
  infoText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
    flexShrink: 1,
  },
  truncatedText: {
    overflow: "hidden",
    flexShrink: 1,
  },
  tooltip: {
    position: "absolute",
    top: -35,
    left: 0,
    backgroundColor: "#222",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    zIndex: 10,
    maxWidth: 220,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 12.5,
  },
});

export default HomeInfo;
