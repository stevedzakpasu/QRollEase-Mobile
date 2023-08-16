import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AppContext } from "../context/AppContext";

import axios from "axios";

export default function CourseDetails({ route, navigation }) {
  const { courseItem } = route.params;
  const { token, setToken, userInfo, setLecturesData, lecturesData } =
    useContext(AppContext);
  const initialLectures = lecturesData[courseItem.course_code] || [];
  const [lectures, setLectures] = useState(initialLectures);
  const options = {
    method: "GET",
    url: `https://qrollease-api-112d897b35ef.herokuapp.com/api/lectures/${courseItem.course_code}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${JSON.parse(token)} `,
    },
  };

  const updateLectures = async (courseId) => {
    try {
      const response = await axios(options);
      setLecturesData((prevData) => ({
        ...prevData,
        [courseId]: response.data,
      }));
      setLectures(response.data); // Update local state with fresh data
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const response = await axios(options);
        updateLectures(courseItem.course_code, response.data);
        setLectures(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLectures(); // Always fetch lectures regardless of the current state
  }, [courseItem.course_code, setLecturesData]);

  useEffect(() => {
    if (!lecturesData[courseItem.course_code]) {
      updateLectures(courseItem.course_code);
    }
  }, [courseItem.course_code, lecturesData, setLecturesData]);

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
