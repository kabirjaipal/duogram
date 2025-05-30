import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, {
  Marker,
  Polyline,
  PROVIDER_GOOGLE,
  Callout,
  MapPressEvent,
} from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useThemeContext } from "@/context/ThemeContext";
import { calculateDistance, calculateMidpoint } from "@/lib/functions";
import { useGlobalContext } from "@/context/GlobalProvider";
import Loading from "./Loading";

interface User {
  id: string;
  name: string;
  avatar: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

interface Reminder {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  message: string;
}

interface Props {
  location?: {
    coords: {
      latitude: number;
      longitude: number;
    };
  } | null;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  handleUserData: (username: string) => void;
  users: User[];
}

const DISTANCE_THRESHOLD = 0.1;

const HomeMap: React.FC<Props> = ({
  location,
  initialRegion,
  handleUserData,
  users,
}) => {
  if (!location || !initialRegion || !users) {
    return <Loading />;
  }

  const { theme } = useThemeContext();
  const { user } = useGlobalContext();
  const mapRef = useRef<MapView>(null);
  const [mapType, setMapType] = useState<"standard" | "hybrid">("hybrid");
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const addReminder = (
    latitude: number,
    longitude: number,
    message: string
  ) => {
    const newReminder: Reminder = {
      id: `${latitude}-${longitude}-${Date.now()}`,
      coordinate: { latitude, longitude },
      message,
    };
    setReminders([...reminders, newReminder]);
  };

  useEffect(() => {
    if (location) {
      reminders.forEach((reminder) => {
        const distance = calculateDistance(
          location.coords.latitude,
          location.coords.longitude,
          reminder.coordinate.latitude,
          reminder.coordinate.longitude
        );
        if (distance < DISTANCE_THRESHOLD) {
          Alert.alert(`Reminder: ${reminder.message}`);
        }
      });
    }
  }, [location, reminders]);

  const coordinates = users.map((user) => user.location);
  const midpoint =
    coordinates.length > 1 ? calculateMidpoint(coordinates) : null;
  const distance =
    coordinates.length > 1
      ? calculateDistance(
          coordinates[0].latitude,
          coordinates[0].longitude,
          coordinates[1].latitude,
          coordinates[1].longitude
        )
      : null;

  // useEffect(() => {
  //   if (mapRef.current && users.length > 0) {
  //     const allCoordinates = users.map((user) => user.location);
  //     if (location) {
  //       allCoordinates.push(location.coords);
  //     }
  //     mapRef.current.fitToCoordinates(allCoordinates, {
  //       edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
  //       animated: true,
  //     });
  //   }
  // }, [users, location]);

  const goToCurrentLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        ...location.coords,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
    }
  };

  const goToLocation = (latitude: number, longitude: number) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      });
    }
  };

  const goToInitialRegion = () => {
    if (mapRef.current && users.length > 0) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
    handleUserData(user?.username!);
  };

  const handleMapLongPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    Alert.alert(
      `Long press at ${coordinate.latitude}, ${coordinate.longitude}`
    );
    addReminder(coordinate.latitude, coordinate.longitude, "New Reminder");
  };

  const toggleMapType = () => {
    setMapType(mapType === "standard" ? "hybrid" : "standard");
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        mapType={mapType}
        onDoublePress={handleMapLongPress}
      >
        {users.map((user, index) => (
          <Marker
            onPress={() => {
              handleUserData(user.name);
              goToLocation(user.location.latitude, user.location.longitude);
            }}
            key={String(user.id + "-" + index)}
            coordinate={user.location}
            title={user.name}
            description={`${user.name}'s location`}
          >
            <Image
              source={{ uri: user.avatar }}
              style={{ ...styles.avatar, borderColor: theme.secondaryColor }}
              resizeMode="cover"
            />
            <Callout>
              <Text>{user.name}</Text>
            </Callout>
          </Marker>
        ))}
        <Polyline
          coordinates={coordinates}
          strokeColor={theme.secondaryColor}
          strokeWidth={4}
        />
        {reminders.map((reminder) => (
          <Marker
            key={reminder.id}
            coordinate={reminder.coordinate}
            pinColor="red"
            title="Reminder"
            description={reminder.message}
          />
        ))}
        {midpoint && (
          <Marker coordinate={midpoint} pinColor={theme.secondaryColor}>
            <View style={styles.callout}>
              <Text
                style={{
                  color: theme.tintColor,
                  backgroundColor: theme.secondaryColor,
                  padding: 5,
                  borderRadius: 5,
                  textAlign: "center",
                }}
              >
                {distance?.toFixed(2)} KM
              </Text>
            </View>
          </Marker>
        )}
      </MapView>
      <TouchableOpacity
        style={{
          ...styles.currentLocationButton,
          backgroundColor: theme.secondaryColor,
        }}
        onPress={goToCurrentLocation}
      >
        <Ionicons name="navigate-circle" size={24} color={theme.tintColor} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          ...styles.mapTypeButton,
          backgroundColor: theme.secondaryColor,
        }}
        onPress={toggleMapType}
      >
        <Ionicons
          name={mapType === "standard" ? "map" : "map-outline"}
          size={24}
          color={theme.tintColor}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          ...styles.initialLocationButton,
          backgroundColor: theme.secondaryColor,
        }}
        onPress={goToInitialRegion}
      >
        <Ionicons name="home" size={24} color={theme.tintColor} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
  currentLocationButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    borderRadius: 36,
    padding: 8,
    elevation: 10,
  },
  mapTypeButton: {
    position: "absolute",
    bottom: 80,
    right: 16,
    borderRadius: 24,
    padding: 8,
    elevation: 10,
  },
  initialLocationButton: {
    position: "absolute",
    bottom: 144,
    right: 16,
    borderRadius: 24,
    padding: 8,
    elevation: 10,
  },
  callout: {
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default HomeMap;
