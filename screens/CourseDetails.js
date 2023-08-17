import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  Pressable,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AppContext } from "../context/AppContext";
import {
  Modal,
  Portal,
  PaperProvider,
  ActivityIndicator,
  Dialog,
  TextInput,
} from "react-native-paper";
import axios from "axios";

export default function CourseDetails({ route, navigation }) {
  const { courseItem } = route.params;
  const [refreshing, setRefreshing] = useState(false); // State to handle refresh
  const [lectureDescription, setLectureDescription] = useState("");
  const [lectureLocation, setLectureLocation] = useState("");
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
    flex: 0.1,
    borderRadius: 25,
    margin: 50,
  };
  const { token, setToken, userInfo, setLecturesData, lecturesData } =
    useContext(AppContext);
  const initialLectures = lecturesData[courseItem.course_code] || [];
  const [lectures, setLectures] = useState(initialLectures);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const showDialog = () => setIsDialogVisible(true);
  const showModal = () => setIsModalVisible(true);

  const hideModal = () => setIsModalVisible(false);

  const hideDialog = () => setIsDialogVisible(false);
  const isInputValid = () =>
    lectureLocation !== "" && lectureDescription !== "";
  const handleCreateLecture = async () => {
    if (isInputValid()) {
      hideDialog();
      showModal();
      await axios(options2);
      hideModal();
    } else {
      // error handling
      // showErrorDialog();
    }
  };
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
        updateLectures(courseItem.course_code);
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
    <TouchableOpacity
      onPress={() => handleItemPress(item)}
      style={styles.lectureItem}
    >
      <Text style={styles.lectureTitle}>{item.lecture_description}</Text>
      <Text style={styles.lectureDescription}>{item.lecture_location}</Text>
    </TouchableOpacity>
  );
  const handleItemPress = (item) => {
    navigation.navigate("LectureDetails", { lectureItem: item });
  };

  return (
    <PaperProvider>
      <Portal>
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
                  No lectures found
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

        <Modal
          visible={isModalVisible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
          dismissable={false}
        >
          <ActivityIndicator animating={true} color="#40cbc3" />
          <Text style={{ fontFamily: "bold" }}>
            Lecture Creation in progress
          </Text>
        </Modal>
        <Dialog
          visible={isDialogVisible}
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
                style={{ width: "100%", height: 50, backgroundColor: "white" }}
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
                style={{ width: "100%", height: 50, backgroundColor: "white" }}
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
                CREATE
              </Text>
            </Pressable>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
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
});
