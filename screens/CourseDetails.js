import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Dialog,
  Modal,
  PaperProvider,
  Portal,
  TextInput,
} from "react-native-paper";
import { AppContext } from "../context/AppContext";
import { Feather } from "@expo/vector-icons";
export default function CourseDetails({ route, navigation }) {
  const { courseItem } = route.params;
  const [refreshing, setRefreshing] = useState(false); // State to handle refresh
  const [lectureDescription, setLectureDescription] = useState("");
  const [lectureLocation, setLectureLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
    flex: 0.1,
    borderRadius: 25,
    margin: 50,
  };
  const {
    token,
    userInfo,
    setLecturesData,
    lecturesData,
    studentInfo,
    attendance,
    setAttendance,
  } = useContext(AppContext);
  const initialLectures = lecturesData[courseItem.course_code] || [];
  const [lectures, setLectures] = useState(initialLectures);
  const sortedLectures = lectures.slice().sort((a, b) => b.id - a.id);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const isFocused = useIsFocused();

  const hideModal = () => setIsModalVisible(false);

  const hideDialog = () => setIsDialogVisible(false);
  const isInputValid = () =>
    lectureLocation !== "" && lectureDescription !== "";
  const handleCreateLecture = async () => {
    if (isInputValid()) {
      navigation.navigate("Mapview", { courseItem: courseItem });
      hideModal();
    }
  };
  function didStudentAttend(studentId, lectureId) {
    return attendance.some(
      (record) =>
        record.student_id === studentId && record.lecture_id === lectureId
    );
  }

  const options = {
    method: "GET",
    url: `https://qrollease-api-112d897b35ef.herokuapp.com/api/lectures/${courseItem.course_code}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${JSON.parse(token)} `,
    },
  };

  const options2 = {
    method: "POST",
    url: `https://qrollease-api-112d897b35ef.herokuapp.com/api/lectures`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(token)} `,
    },
    data: {
      course_code: courseItem.course_code,
      lecture_description: lectureDescription,
      lecture_location: lectureLocation,
      is_active: true,
    },
  };

  const options3 = {
    method: "GET",
    url: `https://qrollease-api-112d897b35ef.herokuapp.com/api/lectures/staff/${courseItem.course_code}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${JSON.parse(token)} `,
    },
  };
  const options4 = {
    method: "GET",
    url: `https://qrollease-api-112d897b35ef.herokuapp.com/api/my_attendance/`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${JSON.parse(token)} `,
    },
  };
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await updateLectures();
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setRefreshing(false);
  };

  const updateLectures = async (courseId) => {
    try {
      const response = await axios(userInfo.is_staff ? options3 : options);
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
    if (isFocused) {
      // Set refreshing state to trigger RefreshControl
      setRefreshing(true);

      // Fetch lectures or perform any necessary actions here
      const fetchLectures = async () => {
        try {
          const response = await axios(userInfo.is_staff ? options3 : options);
          updateLectures(courseItem.course_code);
          setLectures(response.data);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        } finally {
          setRefreshing(false); // Set refreshing state back to false
        }
      };
      const fetchAttendance = async () => {
        try {
          const response = await axios(options4);
          setAttendance(response.data);
        } catch (error) {
          console.log(error);
        }
      };
      if (!userInfo.is_staff) {
        fetchAttendance();
      }

      fetchLectures();
    }
  }, [isFocused, courseItem.course_code, userInfo.is_staff]);

  useEffect(() => {
    if (!lecturesData[courseItem.course_code]) {
      updateLectures(courseItem.course_code);
    }
  }, [courseItem.course_code, lecturesData, setLecturesData]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleItemPress(item)}
      style={styles.lectureItem}
    >
      {!userInfo.is_staff && (
        <View style={{ position: "absolute", top: 0, right: 0 }}>
          {didStudentAttend(studentInfo.student_id, item.id) ? (
            <Feather
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "green",
                padding: 5,
                borderRadius: 5,
              }}
              name="user-check"
              size={20}
              color="white"
            />
          ) : (
            <Feather
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: "red",
                padding: 5,
                borderRadius: 5,
              }}
              name="user-x"
              size={20}
              color="white"
            />
          )}
        </View>
      )}

      <View style={{ flexDirection: "column" }}>
        <Text style={styles.lectureTitle}>{item.lecture_description}</Text>
        <Text style={styles.lectureDescription}>{item.lecture_location}</Text>
      </View>

      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          width: "20%",
        }}
      >
        <MaterialCommunityIcons
          name="record-circle-outline"
          size={24}
          color={item.is_active ? "green" : "red"}
        />
        <Text
          style={{
            fontFamily: "light",
            color: item.is_active ? "green" : "red",
          }}
        >
          {item.is_active ? "In Session" : "Ended"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleItemPress = (item) => {
    navigation.navigate("LectureDetails", { lectureItem: item });
  };

  return (
    <PaperProvider>
      <Portal>
        <View style={styles.container}>
          <View style={{ flexDirection: "column", flex: 1 }}>
            <View style={styles.header}>
              <TouchableOpacity style={{ paddingRight: 10, borderRadius: 15 }}>
                <Ionicons
                  name="arrow-back-outline"
                  size={24}
                  color="black"
                  onPress={() => navigation.goBack()}
                />
              </TouchableOpacity>

              <Text style={styles.headerText}>
                {courseItem.course_title} ({courseItem.course_code})
              </Text>
            </View>

            <FlatList
              data={sortedLectures}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                !isLoading && (
                  <View style={styles.imageContainer}>
                    <Image
                      style={[
                        styles.image,
                        {
                          width: 200,
                          height: 200,
                          // alignSelf: "center",
                          // flex: 1,
                          // marginVertical: 5,
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
                      No lectures found
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
                onPress={() =>
                  navigation.navigate("Mapview", { courseItem: courseItem })
                }
              >
                <Ionicons name="md-add-circle-sharp" size={36} color="white" />
              </Pressable>
            )}
          </View>

          <Modal
            visible={isModalVisible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}
            dismissable={false}
          >
            <ActivityIndicator animating={true} color="#40cbc3" />
          </Modal>
          <Dialog
            visible={isDialogVisible}
            onDismiss={hideDialog}
            style={{
              backgroundColor: "white",
              justifyContent: "space-between",
              alignItems: "center",
              // paddingVertical: 24,
            }}
          >
            <Dialog.Title style={{ alignSelf: "center" }}>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Ionicons name="create" size={55} color="black" />
                <Text style={{ fontFamily: "semibold" }}>New Lecture</Text>
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
                      Lecture Description
                    </Text>
                  }
                  style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: "white",
                  }}
                  activeUnderlineColor="#40cbc3"
                  underlineColor="black"
                  cursorColor="black"
                  onChangeText={(text) => setLectureDescription(text)}
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
                      Lecture Location
                    </Text>
                  }
                  style={{
                    width: "100%",
                    height: 50,
                    backgroundColor: "white",
                  }}
                  activeUnderlineColor="#40cbc3"
                  underlineColor="black"
                  cursorColor="black"
                  onChangeText={(text) => setLectureLocation(text)}
                  contentStyle={{ fontFamily: "medium", color: "black" }}
                  // onChangeText={(text) => setEmail(text)}
                />
              </View>
            </Dialog.Content>
            <Dialog.Actions style={{ alignSelf: "center" }}>
              <Pressable style={styles.createBtn} onPress={handleCreateLecture}>
                <Text
                  style={{
                    alignSelf: "center",
                    color: "white",
                    fontFamily: "bold",
                  }}
                >
                  NEXT
                </Text>
              </Pressable>
            </Dialog.Actions>
          </Dialog>
        </View>
      </Portal>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontFamily: "bold",
    fontSize: 24,
  },

  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  lectureItem: {
    flex: 1, // Use flex property to fill available horizontal space
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    marginBottom: 12,
    marginVertical: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lectureTitle: {
    fontSize: 18,
    fontFamily: "semibold",
  },
  lectureDescription: {
    fontSize: 14,
    fontFamily: "medium",
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
  map: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    width: "100%",
    height: "5%",
  },
  listContent: {
    flexGrow: 1,
    width: "100%",
  },
});
