import { useState, useEffect } from "react";
import * as Location from "expo-location";

const useLocation = (permissionGranted: boolean) => {
  const [locationData, setLocationData] = useState({
    location: null as Location.LocationObject | null,
    currentLocation: null as string | null,
    initialRegion: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
  });

  useEffect(() => {
    let watcher: Location.LocationSubscription | null = null;

    const fetchLocation = async () => {
      if (permissionGranted) {
        try {
          // Start watching the location
          watcher = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.Highest,
              timeInterval: 30000, // Update every 30 seconds
              distanceInterval: 50, // Update every 50 meters
            },
            async (loc) => {
              const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
              });

              const currentLocation =
                reverseGeocode.length > 0
                  ? `${reverseGeocode[0].formattedAddress}`
                  : null;

              setLocationData({
                location: loc,
                currentLocation,
                initialRegion: {
                  latitude: loc.coords.latitude,
                  longitude: loc.coords.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                },
              });
            }
          );
        } catch (error) {
          console.error("Error setting up location watcher:", error);
        }
      }
    };

    fetchLocation();

    // Clean up the location watcher on component unmount or when permission changes
    return () => {
      if (watcher) {
        watcher.remove();
      }
    };
  }, [permissionGranted]);

  return locationData;
};

export default useLocation;
