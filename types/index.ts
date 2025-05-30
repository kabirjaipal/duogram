import themes from "@/lib/themes";
import { BatteryState } from "expo-battery";
import { LocationObject } from "expo-location";

export type Theme = {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  tintColor: string;
};

export type ThemeContextType = {
  theme: Theme;
  switchTheme: (themeName: keyof typeof themes) => void;
};

export interface Relationship {
  $id: string;
  relationshipId: string;
  wifeId: string;
  husbandId: string;
  connectionCode: string;
  relationshipDate: string;
  wifeBirthday: string;
  husbandBirthday: string;
}

export interface Message {
  $id: string;
  content: string;
  senderId: string;
  timestamp: string;
  replyTo: string | null;
  contentType: string;
}

export interface HomeInfoTypes {
  deviceInfo: any;
  batteryLevel: number | null;
  networkInfo: string | null;
  currentLocation: string | null;
  batteryState: BatteryState | null;
}

// Define the types for device info
interface DeviceInfo {
  name: string;
}

// Define the types for location coordinates
interface Coordinates {
  accuracy: number;
  longitude: number;
  altitude: number;
  heading: number;
  latitude: number;
  altitudeAccuracy: number;
  speed: number;
}

// Define the main props type
export interface UserDataInterface {
  deviceInfo: DeviceInfo;
  networkInfo: string;
  batteryState: number; // Battery.BatteryState
  batteryLevel: number;
  location: Coordinates;
  currentLocation: string;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export interface User {
  $id: string;
  email: string;
  password: string;
  username: string;
  avatar: string;
  info: UserDataInterface;
  gender: string;
  relationshipId: string;
}
