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
  ToastAndroid,
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
import { useIsFocused } from "@react-navigation/native";
export default function Home({ navigation }) {
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogvisible, setIsDialogVisible] = useState(false);
  const {
    token,
    setToken,
    userInfo,
    setStaffInfo,
    setStudentInfo,
    setAttendance,
  } = useContext(AppContext);
  const [showSearchBar, setShowSearchBar] = useState(false); // State to handle search bar visibility
  const [searchQuery, setSearchQuery] = useState(""); // State to handle search query
  const [filteredCourses, setFilteredCourses] = useState(courses); // State to hold filtered courses
  const [refreshing, setRefreshing] = useState(false); // State to handle refresh
  const [isModalvisible, setIsModalVisible] = useState(false);
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);
  const showErrorDialog = () => setIsErrorDialogVisible(true);
  const isFocused = useIsFocused();
  const hideErrorDialog = () => setIsErrorDialogVisible(false);

  const showDialog = () => setIsDialogVisible(true);
  const showModal = () => setIsModalVisible(true);

  const hideModal = () => setIsModalVisible(false);
  const apiUrl =
    "https://qrollease-api-112d897b35ef.herokuapp.com/api/students/me";

  const staffApiUrl =
    "https://qrollease-api-112d897b35ef.herokuapp.com/api/staffs/me";

  const [isStaff, setIsStaff] = useState(userInfo.is_staff);
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await axios(options4);
        setAttendance(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (!isStaff) {
      fetchAttendance();
    }
  }, []);

  const options4 = {
    method: "GET",
    url: `https://qrollease-api-112d897b35ef.herokuapp.com/api/my_attendance/`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${JSON.parse(token)} `,
    },
  };
  useEffect(() => {
    async function fetchData() {
      const options = {
        method: "GET",
        url: isStaff ? staffApiUrl : apiUrl,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      try {
        const InfoResponse = await axios(options);

        {
          !isStaff
            ? setStudentInfo(InfoResponse.data)
            : setStaffInfo(InfoResponse.data);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);
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
    try {
      hideDialog();
      showModal();
      await axios(options);
      await axios(options2);
      hideModal();
    } catch (error) {
      // Handle errors here
      hideModal();
      showErrorDialog();
      console.error(error);
      // You can also display an error message to the user if needed
      // For example: showErrorModal("An error occurred. Please try again later.");
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
    if (isFocused) {
      setRefreshing(true);
    }
    fetchCourses();
  }, [isFocused]);

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
    } finally {
      setRefreshing(false);
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
              fontFamily: "regular",
              width: "95%",
              backgroundColor: "#f0f0f0",
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
            <Text style={styles.headerText}>Courses</Text>
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
            <ActivityIndicator animating={true} color="#40cbc3" />
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
                  !loading && (
                    <View style={styles.imageContainer}>
                      <Image
                        style={[
                          styles.image,
                          {
                            width: 200,
                            height: 200,
                          },
                        ]} // Add width and height style here
                        source={require("../assets/images/no-results.png")}
                        resizeMode="contain" // Use "contain" to fit the image within the specified size
                      />
                      <Text
                        style={{
                          fontFamily: "semibold",
                          fontSize: 28,
                          marginTop: 25,
                        }}
                      >
                        No courses found
                      </Text>
                    </View>
                  )
                }
              />
              {userInfo.is_staff && (
                <Pressable
                  style={{
                    position: "absolute", // Required for positioning

                    bottom: 55,
                    right: 15,
                    padding: 12,
                    backgroundColor: "#40cbc3",
                    borderRadius: 8,
                  }}
                  onPress={showDialog}
                >
                  <Ionicons
                    name="md-add-circle-sharp"
                    size={36}
                    color="white"
                  />
                </Pressable>
              )}
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
        </Modal>
        <Dialog
          visible={isDialogvisible}
          onDismiss={hideDialog}
          style={{
            backgroundColor: "white",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Dialog.Title style={{ alignSelf: "center" }}>
            <Text style={{ fontFamily: "semibold", color: "black" }}>
              New Course
            </Text>
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
            <Pressable
              style={isInputValid() ? styles.createBtn : styles.greyedOutBtn}
              onPress={handleCreateCourse}
              disabled={!isInputValid()}
            >
              <Text
                style={{
                  alignSelf: "center",
                  color: isInputValid() ? "white" : "black",
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
          <Dialog.Title style={{ alignSelf: "center" }}>
            <Entypo name="circle-with-cross" size={36} color="red" />
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={{ textAlign: "center", fontFamily: "bold" }}
              variant="bodyMedium"
            >
              Something went wrong while creating the course
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
    padding: 20,
    marginBottom: 12,
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    width: "100%",
    height: 50,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flex: 1,
  },
  image: {
    // flex: 1,
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
  greyedOutBtn: {
    width: "80%",
    backgroundColor: "#d3d3d3", // Light grey color
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",

    opacity: 0.6, // Reduced opacity to visually indicate disabled state
  },
});
