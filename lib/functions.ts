import { Query } from "react-native-appwrite";
import { config, databases } from "./appwrite";

export const calculateRelationshipDuration = (
  startDate: Date,
  endDate: Date
): string => {
  const diff = Math.abs(endDate.getTime() - startDate.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} years, ${months % 12} months, ${days % 30} days`;
  } else if (months > 0) {
    return `${months} months, ${days % 30} days`;
  } else {
    return `${days} days`;
  }
};

export const calculateRelationshipDays = (startDate: string): string => {
  const start = new Date(startDate);
  const now = new Date();
  const diff = Math.abs(now.getTime() - start.getTime());
  return `${Math.floor(diff / (1000 * 60 * 60 * 24))} Days`;
};

export const calculateDuration = (startDate: string): string => {
  const start = new Date(startDate);
  const now = new Date();
  const diff = Math.abs(now.getTime() - start.getTime());

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} Year${years > 1 ? "s" : ""}`;
  } else if (months > 0) {
    return `${months} Month${months > 1 ? "s" : ""}`;
  } else {
    return `${days} Day${days > 1 ? "s" : ""}`;
  }
};

// Function to calculate the midpoint of the polyline
export const calculateMidpoint = (
  coordinates: { latitude: number; longitude: number }[]
) => {
  const midIndex = Math.floor(coordinates.length / 2);
  if (coordinates.length % 2 === 0) {
    const midLat =
      (coordinates[midIndex - 1].latitude + coordinates[midIndex].latitude) / 2;
    const midLng =
      (coordinates[midIndex - 1].longitude + coordinates[midIndex].longitude) /
      2;
    return { latitude: midLat, longitude: midLng };
  } else {
    return coordinates[midIndex];
  }
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in kilometers
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // Distance in kilometers
  return distance;
};

export const generateDefaultCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#&*_+-";
  const codeLength = 8;
  let code = "";
  for (let i = 0; i < codeLength; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

export const calculateAge = (birthday: Date) => {
  return calculateDuration(birthday.toISOString());
};

export const getNextAnniversary = (startDate: Date): Date => {
  const currentYear = new Date().getFullYear();
  const nextAnniversary = new Date(startDate);
  nextAnniversary.setFullYear(currentYear);

  if (nextAnniversary < new Date()) {
    nextAnniversary.setFullYear(currentYear + 1);
  }

  return nextAnniversary;
};

export const formatTimestamp = (timestamp: string | number | Date) => {
  const date = new Date(timestamp);
  const now = new Date();

  // Extract year, month, and day for both the given date and current date
  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth();
  const dateDay = date.getDate();

  const nowYear = now.getFullYear();
  const nowMonth = now.getMonth();
  const nowDay = now.getDate();

  const timeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // Ensures AM/PM format
  });

  if (dateYear === nowYear && dateMonth === nowMonth && dateDay === nowDay) {
    // Today
    return `Today at ${timeString}`;
  } else if (
    dateYear === nowYear &&
    dateMonth === nowMonth &&
    dateDay === nowDay - 1
  ) {
    // Yesterday
    return `Yesterday at ${timeString}`;
  } else {
    // Date with time
    const dateString = date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return `${dateString} at ${timeString}`;
  }
};

export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

export function getFileType(fileType: string): string {
  const extension = fileType.split("/")[1]?.toLowerCase() || fileType;

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
  const videoExtensions = ["mp4", "avi", "mov", "mkv", "webm"];
  const gifExtensions = ["gif"];

  if (imageExtensions.includes(extension)) {
    return "Image";
  } else if (videoExtensions.includes(extension)) {
    return "Video";
  } else if (gifExtensions.includes(extension)) {
    return "GIF";
  } else {
    return "Unknown";
  }
}

export const isAttachment = (type: string) =>
  type === "GIF" || type === "Image" || type === "Video";

export const deleteOldMessages = async (relationshipId: string) => {
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const response = await databases.listDocuments(
      config.databaseId,
      config.messagesCollectionId,
      [
        Query.lessThan("$createdAt", yesterday),
        Query.equal("relationshipId", relationshipId),
      ]
    );
    for (const message of response.documents) {
      await databases.deleteDocument(
        config.databaseId,
        config.messagesCollectionId,
        message.$id
      );
    }
    console.log("Old messages deleted successfully");
  } catch (error) {
    console.error("Error deleting old messages:", error);
  }
};
