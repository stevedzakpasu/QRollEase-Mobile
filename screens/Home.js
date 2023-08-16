import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
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
  TextInput,
} from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
export default function Home({ navigation }) {
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogvisible, setIsDialogVisible] = useState(false);
  const { token, setToken, userInfo } = useContext(AppContext);
  const [showSearchBar, setShowSearchBar] = useState(false); // State to handle search bar visibility
  const [searchQuery, setSearchQuery] = useState(""); // State to handle search query
  const [filteredCourses, setFilteredCourses] = useState(courses); // State to hold filtered courses
  const [refreshing, setRefreshing] = useState(false); // State to handle refresh
  const [isModalvisible, setIsModalVisible] = useState(false);
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const showErrorDialog = () => setIsErrorDialogVisible(true);

  const hideErrorDialog = () => setIsErrorDialogVisible(false);

  const showDialog = () => setIsDialogVisible(true);
  const showModal = () => setIsModalVisible(true);

  const hideModal = () => setIsModalVisible(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
    flex: 0.1,
    borderRadius: 25,
    margin: 50,
  };
  const options = {
    method: "POST",
    url: "https://qrollease-api-112d897b35ef.herokuapp.com/api/courses",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(token)} `,
    },
    data: {
      course_code: courseCode,
      course_title: courseTitle,
    },
  };

  const options2 = {
    method: "POST",
    url: `https://qrollease-api-112d897b35ef.herokuapp.com/api/staffs/me/courses/add?course_code=${courseCode}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(token)} `,
    },
    data: {
      course_code: courseCode,
      course_title: courseTitle,
    },
  };

  const hideDialog = () => setIsDialogVisible(false);
  const isInputValid = () => courseCode !== "" && courseTitle !== "";
  const handleCreateCourse = async () => {
    if (isInputValid()) {
      hideDialog();
      showModal();
      await axios(options);
      await axios(options2);
      hideModal();
    } else {
      showErrorDialog();
    }
  };

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
        <View style={styles.header}>
          <TextInput
            style={{
              // marginLeft: 25,
              fontFamily: "regular",
              width: "95%",
              backgroundColor: "#f0f0f0",
              // height: "100%",
              // backgroundColor: "white",
            }}
            placeholder="Search courses..."
            value={searchQuery}
            onChangeText={handleSearch}
            activeUnderlineColor="#40cbc3"
            underlineColor="black"
            cursorColor="black"
            contentStyle={{ fontFamily: "medium", color: "black" }}
          />
          <TouchableOpacity
            onPress={toggleSearchBar}
            style={styles.iconContainer}
          >
            <Ionicons name="close" size={24} color="black" />
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
    <PaperProvider>
      <Portal>
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
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
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
              <TouchableOpacity
                style={{
                  position: "absolute", // Required for positioning
                  zIndex: 1,
                  bottom: 55,
                  right: 15,
                }}
                onPress={showDialog}
              >
                <Ionicons name="md-add-circle-sharp" size={48} color="black" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Modal
          visible={isModalvisible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
          dismissable={false}
        >
          <ActivityIndicator animating={true} color="#40cbc3" />
          <Text style={{ fontFamily: "bold" }}>
            Course Creation in progress
          </Text>
        </Modal>
        <Dialog
          visible={isDialogvisible}
          onDismiss={hideDialog}
          style={{
            backgroundColor: "white",
            // justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 24,
          }}
        >
          <Dialog.Title style={{ textAlign: "center" }}>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Ionicons name="create" size={55} color="black" />
              <Text style={{ fontFamily: "semibold" }}>New course</Text>
            </View>
          </Dialog.Title>
          <Dialog.Content>
            <View
              style={{
                flexDirection: "row",

                width: "100%",
                backgroundColor: "white",

                justifyContent: "center",
              }}
            >
              <TextInput
                label={
                  <Text
                    style={{
                      fontFamily: "semibold",
                      color: "black",
                      fontSize: 14,
                    }}
                  >
                    Course Code
                  </Text>
                }
                style={{ width: "100%", height: 50, backgroundColor: "white" }}
                activeUnderlineColor="#40cbc3"
                underlineColor="black"
                cursorColor="black"
                onChangeText={(text) => setCourseCode(text)}
                contentStyle={{ fontFamily: "medium", color: "black" }}
                // onChangeText={(text) => setEmail(text)}
              />
            </View>

            <View
              style={{
                flexDirection: "row",

                width: "100%",
                backgroundColor: "white",

                justifyContent: "center",
              }}
            >
              <TextInput
                label={
                  <Text
                    style={{
                      fontFamily: "semibold",
                      color: "black",
                      fontSize: 14,
                    }}
                  >
                    Course Title
                  </Text>
                }
                style={{ width: "100%", height: 50, backgroundColor: "white" }}
                activeUnderlineColor="#40cbc3"
                underlineColor="black"
                cursorColor="black"
                onChangeText={(text) => setCourseTitle(text)}
                contentStyle={{ fontFamily: "medium", color: "black" }}
                // onChangeText={(text) => setEmail(text)}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions style={{ alignSelf: "center" }}>
            <Pressable style={styles.createBtn} onPress={handleCreateCourse}>
              <Text
                style={{
                  alignSelf: "center",
                  color: "white",
                  fontFamily: "bold",
                }}
              >
                CREATE
              </Text>
            </Pressable>
          </Dialog.Actions>
        </Dialog>
        <Dialog
          visible={isErrorDialogVisible}
          onDismiss={hideErrorDialog}
          style={{
            backgroundColor: "white",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Dialog.Title style={{ textAlign: "center" }}>
            <Entypo name="circle-with-cross" size={36} color="red" />
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={{ textAlign: "center", fontFamily: "bold" }}
              variant="bodyMedium"
            >
              All fields are required!
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={{ alignSelf: "center" }}>
            <Pressable
              style={styles.dismissBtn}
              onPress={() => hideErrorDialog()}
            >
              <Text
                style={{
                  alignSelf: "center",
                  color: "white",
                  fontFamily: "bold",
                }}
              >
                Gotcha!
              </Text>
            </Pressable>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
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
    // marginBottom: 15,
  },
  searchBar: {
    height: 30,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    // marginBottom: 10,
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#f0f0f0",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#f0f0f0",
  },
  iconContainer: {
    // position: "absolute",
    // right: 2,
    // top: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    // alignSelf: "center",
    width: "100%",
    // backgroundColor: "black",
    height: 50,
    // height: 80,
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
  createBtn: {
    width: "80%",
    backgroundColor: "#40cbc3",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  dismissBtn: {
    width: "80%",
    backgroundColor: "#40cbc3",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
