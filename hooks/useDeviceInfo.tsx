import { useState, useEffect } from "react";
import * as Device from "expo-device";
import NetInfo from "@react-native-community/netinfo";

const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    device: {} as any,
    networkInfo: null as string | null,
  });

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        const device = { name: Device.deviceName };
        const networkState = await NetInfo.fetch();

        setDeviceInfo({
          device,
          networkInfo: networkState.type,
        });
      } catch (error) {
        console.error("Error fetching device info:", error);
      }
    };

    fetchDeviceInfo();
  }, []);

  return deviceInfo;
};

export default useDeviceInfo;
