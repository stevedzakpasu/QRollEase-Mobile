import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function CourseDetails({ route, navigation }) {
  const { courseItem } = route.params;

  const lectures = [
    {
      id: 1,
      lecture_description: "Lecture 1",
      lecture_location: "NNB",
    },
    { id: 2, lecture_description: "Lecture 2", lecture_location: "JQB" },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.lectureItem}>
      <Text style={styles.lectureTitle}>{item.lecture_description}</Text>
      <Text style={styles.lectureDescription}>{item.lecture_location}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TouchableOpacity style={{ paddingRight: 10, borderRadius: 15 }}>
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>

        <Text style={styles.header}>
          {courseItem.course_title} ({courseItem.course_code})
        </Text>
      </View>

      <FlatList
        data={lectures}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontFamily: "bold",
    fontSize: 24,
  },

  container: {
    flex: 1,
    width: "100%",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  lectureItem: {
    flex: 1, // Use flex property to fill available horizontal space
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    width: "100%",
  },
  lectureTitle: {
    fontSize: 18,
    fontFamily: "semibold",
  },
  lectureDescription: {
    fontSize: 14,
    fontFamily: "medium",
  },
});
