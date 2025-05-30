import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  Modal,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useThemeContext } from "@/context/ThemeContext";
import {
  calculateAge,
  calculateRelationshipDuration,
  getNextAnniversary,
} from "@/lib/functions";
import DateTimePicker from "@react-native-community/datetimepicker";
import Section from "../../components/RelationshipSection";
import Card from "../../components/RelationshipCard";

const Relationship: React.FC = () => {
  const { user, partner, relationship } = useGlobalContext();
  const { theme } = useThemeContext();

  const [dates, setDates] = useState({
    husbandBirthday: new Date(relationship?.husbandBirthday!),
    wifeBirthday: new Date(relationship?.wifeBirthday!),
    relationshipStartDate: new Date(relationship?.relationshipDate!),
  });

  const [currentPicker, setCurrentPicker] = useState<
    "husband" | "wife" | "relationshipStart" | null
  >(null);

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (currentPicker && selectedDate) {
      setDates((prevDates) => ({
        ...prevDates,
        [currentPicker === "husband"
          ? "husbandBirthday"
          : currentPicker === "wife"
          ? "wifeBirthday"
          : "relationshipStartDate"]: selectedDate,
      }));
      setCurrentPicker(null);
    }
  };

  const showDatePicker = (picker: "husband" | "wife" | "relationshipStart") => {
    setCurrentPicker(picker);
  };

  const relationshipDuration = calculateRelationshipDuration(
    dates.relationshipStartDate,
    new Date()
  );
  const husbandAge = calculateAge(dates.husbandBirthday);
  const wifeAge = calculateAge(dates.wifeBirthday);
  const nextAnniversaryDate = getNextAnniversary(dates.relationshipStartDate);

  const relationshipDetails = [
    { title: "Duration", value: relationshipDuration },
    {
      title: "Start Date",
      value: dates.relationshipStartDate.toDateString(),
      onPress: () => showDatePicker("relationshipStart"),
      isEditable: true,
    },
    { title: "Next Anniversary", value: nextAnniversaryDate.toDateString() },
  ];

  const birthdays = [
    {
      title: `${user?.username}'s Birthday`,
      date: dates.husbandBirthday.toDateString(),
      age: husbandAge,
      onPress: () => showDatePicker("husband"),
      isEditable: true,
    },
    {
      title: `${partner?.username}'s Birthday`,
      date: dates.wifeBirthday.toDateString(),
      age: wifeAge,
      onPress: () => showDatePicker("wife"),
      isEditable: true,
    },
  ];

  return (
    <SafeAreaView
      style={{ ...styles.container, backgroundColor: theme.primaryColor }}
    >
      <ScrollView>
        <View style={styles.profileHeader}>
          <View style={styles.avatarsContainer}>
            <View style={styles.avatar}>
              <Image
                source={{ uri: user?.avatar }}
                style={{
                  ...styles.avatarImage,
                  borderColor: theme.secondaryColor,
                }}
              />
              <Text style={{ ...styles.avatarName, color: theme.textColor }}>
                {user?.username}
              </Text>
            </View>
            <View style={styles.connectLineContainer}>
              <View
                style={{
                  ...styles.connectLine,
                  backgroundColor: theme.secondaryColor,
                }}
              />
              <Text style={styles.heart}>❤️</Text>
              <View
                style={{
                  ...styles.connectLine,
                  backgroundColor: theme.secondaryColor,
                }}
              />
            </View>
            <View style={styles.avatar}>
              <Image
                source={{ uri: partner?.avatar }}
                style={{
                  ...styles.avatarImage,
                  borderColor: theme.secondaryColor,
                }}
              />
              <Text style={{ ...styles.avatarName, color: theme.textColor }}>
                {partner?.username}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.infoSection}>
          <Section title="Relationship Details" theme={theme}>
            {relationshipDetails.map((detail, index) => (
              <Card
                key={index}
                title={detail.title}
                value={detail.value}
                theme={theme}
                onPress={detail.onPress}
                isEditable={detail.isEditable}
              />
            ))}
          </Section>
          <Section title="Birthdays" theme={theme}>
            {birthdays.map((birthday, index) => (
              <Card
                key={index}
                title={birthday.title}
                value={`${birthday.date} (Age ${birthday.age})`}
                theme={theme}
                onPress={birthday.onPress}
                isEditable={birthday.isEditable}
              />
            ))}
          </Section>
        </View>
        <Modal visible={currentPicker !== null} transparent={true}>
          {currentPicker && (
            <DateTimePicker
              value={
                currentPicker === "relationshipStart"
                  ? dates.relationshipStartDate
                  : currentPicker === "husband"
                  ? dates.husbandBirthday
                  : dates.wifeBirthday
              }
              mode="date"
              display="spinner"
              onChange={handleDateChange}
            />
          )}
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    borderBottomColor: "#666",
    borderBottomWidth: 1,
    padding: 25,
    marginBottom: 20,
  },
  avatarsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    alignItems: "center",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
    borderWidth: 3,
  },
  avatarName: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  connectLineContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: 10,
  },
  connectLine: {
    height: 2,
    flex: 1,
  },
  heart: {
    fontSize: 25,
    marginHorizontal: 5,
  },
  infoSection: {
    padding: 10,
    paddingTop: 0,
  },
});

export default Relationship;
