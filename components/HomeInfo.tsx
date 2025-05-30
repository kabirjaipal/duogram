import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as Battery from "expo-battery";
import { useThemeContext } from "@/context/ThemeContext";
import { UserDataInterface } from "@/types";

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

  if (!batteryState) {
    return null;
  }

  let batteryIcon = "battery-half";
  let batteryColor = theme.secondaryColor;
  if (batteryState === Battery.BatteryState.FULL) {
    batteryIcon = "battery-full";
  } else if (batteryState === Battery.BatteryState.CHARGING) {
    batteryIcon = "battery-charging";
  } else {
    if (batteryLevel * 100 < 20) {
      batteryColor = "#ff6347";
    }
  }

  return (
    <View
      style={{ ...styles.infoContainer, backgroundColor: theme.primaryColor }}
    >
      {/* Username */}
      <View style={styles.infoRowFirst}>
        <FontAwesome name="user" size={25} color={theme.secondaryColor} />
        <Text style={{ ...styles.infoText, color: theme.textColor }}>
          {selectedUsername}
        </Text>
      </View>

      {/* Device Info, WiFi, Battery */}
      <View style={{ ...styles.infoRow, borderColor: theme.secondaryColor }}>
        <TouchableWithoutFeedback
          onPressIn={() => setShowTooltip(true)}
          onPressOut={() => setShowTooltip(false)}
        >
          <View style={styles.infoItem}>
            <FontAwesome name="mobile" size={25} color={theme.secondaryColor} />
            <Text
              style={[
                styles.infoText,
                styles.truncatedText,
                { color: theme.textColor },
              ]}
              numberOfLines={1}
            >
              {deviceInfo.name}
            </Text>
            {/* Tooltip */}
            {showTooltip && (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>{deviceInfo.name}</Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.infoItem}>
          <FontAwesome name="wifi" size={25} color={theme.secondaryColor} />
          <Text style={{ ...styles.infoText, color: theme.textColor }}>
            {networkInfo || ""}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name={batteryIcon as any} size={25} color={batteryColor} />
          <Text style={[styles.infoText, { color: theme.textColor }]}>
            {(batteryLevel * 100).toFixed(0)}%
          </Text>
        </View>
      </View>

      {/* Location */}
      <View style={[styles.infoRowLast, { borderColor: theme.secondaryColor }]}>
        <FontAwesome name="map-marker" size={25} color={theme.secondaryColor} />
        <Text style={{ ...styles.infoText, color: theme.textColor }}>
          {currentLocation}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoRowFirst: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoRowLast: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    flex: 1,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 10,
    textTransform: "capitalize",
    fontWeight: "bold",
    overflow: "hidden",
  },
  truncatedText: {
    overflow: "hidden",
  },
  tooltip: {
    position: "absolute",
    top: -25,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    zIndex: 1,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 12,
  },
});

export default HomeInfo;
