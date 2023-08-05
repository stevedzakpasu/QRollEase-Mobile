import { StyleSheet, Text, View, FlatList } from "react-native";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import {
  Modal,
  Portal,
  PaperProvider,
  ActivityIndicator,
  Dialog,
} from "react-native-paper";
export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, setToken } = useContext(AppContext);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const headers = {
        accept: "application/json",
        Authorization: `Bearer ${JSON.parse(token)}`,
      };

      const response = await axios.get(
        "https://qrollease-api-112d897b35ef.herokuapp.com/api/students/me/courses",
        { headers }
      );
      setCourses(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.courseItem}>
      <Text style={styles.courseTitle}>{item.course_title}</Text>
      <Text style={styles.courseDescription}>{item.course_code}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={courses}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  listContent: {
    paddingVertical: 8,
  },
  courseItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  courseDescription: {
    fontSize: 14,
    marginTop: 8,
  },
});
