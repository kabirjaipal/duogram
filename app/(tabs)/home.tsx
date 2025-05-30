import DaysInRelationship from "@/components/DaysInRelationship";
import HomeInfo from "@/components/HomeInfo";
import HomeMap from "@/components/HomeMap";
import Loading from "@/components/Loading";
import { useGlobalContext } from "@/context/GlobalProvider";
import useBattery from "@/hooks/useBattery";
import useDeviceInfo from "@/hooks/useDeviceInfo";
import useLocation from "@/hooks/useLocation";
import usePermissions from "@/hooks/usePermissions";
import { updatePartnerInfo } from "@/lib/appwrite";
import { UserDataInterface } from "@/types";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home: React.FC = () => {
  const { user, partner } = useGlobalContext();
  const permissionStatus = usePermissions();
  const locationData = useLocation(permissionStatus.location === true);
  const batteryData = useBattery();
  const deviceInfo = useDeviceInfo();
  const [selectedUsername, setSelectedUsername] = useState<string | null>(
    user?.username || null
  );
  const [markerUsers, setMarkerUsers] = useState<any[]>([]);
  const [currentUserData, setCurrentUserData] =
    useState<UserDataInterface | null>(null);
  const [displayedUserData, setDisplayedUserData] =
    useState<UserDataInterface | null>(null);

  useEffect(() => {
    if (user && partner) {
      const partnerInfo = JSON.parse(partner.info as unknown as string);
      setMarkerUsers([
        {
          id: user.$id,
          name: user.username,
          avatar: user.avatar,
          location: {
            latitude: locationData.location?.coords.latitude,
            longitude: locationData.location?.coords.longitude,
          },
        },
        {
          id: partner.$id,
          name: partner.username,
          avatar: partner.avatar,
          location: {
            latitude: partnerInfo.location.coords.latitude,
            longitude: partnerInfo.location.coords.longitude,
          },
        },
      ]);
    }
  }, [user, partner, locationData.location]);

  useEffect(() => {
    setCurrentUserData({
      deviceInfo: deviceInfo.device,
      batteryLevel: batteryData.batteryLevel,
      networkInfo: deviceInfo.networkInfo,
      currentLocation: locationData.currentLocation,
      batteryState: batteryData.batteryState,
      initialRegion: locationData.initialRegion,
      location: locationData.location,
    } as unknown as UserDataInterface);
  }, [deviceInfo, batteryData, deviceInfo, locationData]);

  useEffect(() => {
    if (selectedUsername === user?.username) {
      setDisplayedUserData(currentUserData);
    } else {
      setDisplayedUserData(
        partner?.info ? JSON.parse(partner.info as unknown as string) : null
      );
    }
  }, [selectedUsername, currentUserData, partner]);

  useEffect(() => {
    if (user?.$id && currentUserData) {
      updatePartnerInfo(user.$id, JSON.stringify(currentUserData));
    }
  }, [user?.$id, currentUserData]);

  const handleUserData = useCallback(
    (username: string) => {
      setSelectedUsername(username || user?.username || null);
    },
    [user?.username]
  );

  if (!currentUserData || !partner) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: 32, backgroundColor: "#000" }} />
      <StatusBar style="light" />
      <DaysInRelationship />
      {locationData ? (
        <HomeMap
          location={locationData.location}
          initialRegion={locationData.initialRegion}
          handleUserData={handleUserData}
          users={markerUsers}
        />
      ) : (
        <Loading />
      )}
      {displayedUserData ? (
        <HomeInfo
          userData={displayedUserData}
          selectedUsername={selectedUsername!}
        />
      ) : (
        <Loading />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Home;
