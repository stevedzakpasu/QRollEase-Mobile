import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  RefreshControl,
  Pressable,
  Image,
} from "react-native";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import {
  Modal,
  Portal,
  PaperProvider,
  ActivityIndicator,
  Dialog,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
export default function Home({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, setToken, userInfo } = useContext(AppContext);
  const [showSearchBar, setShowSearchBar] = useState(false); // State to handle search bar visibility
  const [searchQuery, setSearchQuery] = useState(""); // State to handle search query
  const [filteredCourses, setFilteredCourses] = useState(courses); // State to hold filtered courses
  const [refreshing, setRefreshing] = useState(false); // State to handle refresh

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchCourses();
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    // Filter courses based on the search query whenever searchQuery changes
    const filtered = courses.filter((course) => {
      const courseTitleMatch = course.course_title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const courseCodeMatch = course.course_code
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return courseTitleMatch || courseCodeMatch;
    });

    setFilteredCourses(filtered);
  }, [searchQuery, courses]); // Add searchQuery and courses as dependencies

  const fetchCourses = async () => {
    try {
      const headers = {
        accept: "application/json",
        Authorization: `Bearer ${JSON.parse(token)}`,
      };

      const response = await axios.get(
        userInfo.is_staff
          ? "https://qrollease-api-112d897b35ef.herokuapp.com/api/staffs/me/courses"
          : "https://qrollease-api-112d897b35ef.herokuapp.com/api/students/me/courses",
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
    <Pressable style={styles.courseItem} onPress={() => handleItemPress(item)}>
      <>
        <Text style={styles.courseTitle}>{item.course_title}</Text>
        <Text style={styles.courseDescription}>{item.course_code}</Text>
      </>
    </Pressable>
  );

  const handleItemPress = (item) => {
    navigation.navigate("CourseDetails", { courseItem: item });
  };

  const toggleSearchBar = () => {
    setShowSearchBar((prevState) => !prevState);
    setSearchQuery("");
  };

  const handleSearch = (text) => {
    setSearchQuery(text);

    // Filter courses based on the search query
    const filtered = courses.filter((course) => {
      const courseTitleMatch = course.course_title
        .toLowerCase()
        .includes(text.toLowerCase());
      const courseCodeMatch = course.course_code
        .toLowerCase()
        .includes(text.toLowerCase());
      return courseTitleMatch || courseCodeMatch;
    });

    setFilteredCourses(filtered);
  };

  const renderHeader = () => {
    if (showSearchBar) {
      return (
        <View style={styles.searchContainer}>
          <TextInput
            style={{ marginLeft: 25, fontFamily: "regular", width: "100%" }}
            placeholder="Search courses..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity
            onPress={toggleSearchBar}
            style={styles.iconContainer}
          >
            <Ionicons name="close" size={32} color="black" />
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <TouchableWithoutFeedback onPress={toggleSearchBar}>
          <View style={styles.header}>
            <Text style={styles.headerText}>My Courses</Text>
            <TouchableOpacity onPress={toggleSearchBar}>
              <Ionicons name="search" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      );
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <View style={{ flexDirection: "column", flex: 1 }}>
          {renderHeader()}
          <FlatList
            data={filteredCourses}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.imageContainer}>
                <Image
                  style={[
                    styles.image,
                    {
                      width: 200,
                      height: 200,
                      alignSelf: "center",
                      flex: 1,
                      marginVertical: 5,
                    },
                  ]} // Add width and height style here
                  source={require("../assets/images/no-results.png")}
                  resizeMode="contain" // Use "contain" to fit the image within the specified size
                />
                <Text style={{ fontFamily: "semibold", fontSize: 28 }}>
                  No courses found
                </Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  listContent: {
    flexGrow: 1,
    width: "100%",
  },
  courseItem: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,

    marginVertical: 12,
    width: "100%",
  },
  courseTitle: {
    fontSize: 18,
    fontFamily: "semibold",
  },
  courseDescription: {
    fontSize: 14,
    fontFamily: "medium",
  },
  headerText: {
    fontSize: 24,
    fontFamily: "bold",
    marginBottom: 15,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    // marginBottom: 10,
    justifyContent: "center",
    width: "100%",
  },
  searchContainer: {
    // width: "100%",
    flexDirection: "row",
    // alignItems: "center",
    // marginBottom: 10,
    // paddingHorizontal: 8,
    borderColor: "#ccc",
    borderWidth: 2,
    borderRadius: 8,
    padding: 5,
    // marginBottom: 10,
  },
  iconContainer: {
    position: "absolute",
    // right: 2,
    // top: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    // justifyContent: "center",
    // alignItems: "center",
  },
  imageContainer: {
    width: "100%", // Adjust this based on your layout requirements
    height: 300, // Adjust this based on your layout requirements
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    resizeMode: "contain",
  },
});
