import { useState, useEffect } from "react";
import * as Battery from "expo-battery";

const useBattery = () => {
  const [batteryData, setBatteryData] = useState({
    batteryLevel: null as number | null,
    batteryState: null as Battery.BatteryState | null,
  });

  useEffect(() => {
    const fetchBatteryData = async () => {
      try {
        const batteryLevel = await Battery.getBatteryLevelAsync();
        const batteryState = await Battery.getBatteryStateAsync();

        setBatteryData({
          batteryLevel,
          batteryState,
        });
      } catch (error) {
        console.error("Error fetching battery data:", error);
      }
    };

    fetchBatteryData();

    const batteryLevelListener = Battery.addBatteryLevelListener(
      ({ batteryLevel }) => {
        setBatteryData((prevState) => ({
          ...prevState,
          batteryLevel,
        }));
      }
    );

    const batteryStateListener = Battery.addBatteryStateListener(
      ({ batteryState }) => {
        setBatteryData((prevState) => ({
          ...prevState,
          batteryState,
        }));
      }
    );

    return () => {
      batteryLevelListener.remove();
      batteryStateListener.remove();
    };
  }, []);

  return batteryData;
};

export default useBattery;
