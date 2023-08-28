import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from "react-native-maps";
import { TextInput } from "react-native-paper";
import {
  ActivityIndicator,
  Dialog,
  Modal,
  PaperProvider,
  Portal,
} from "react-native-paper";
import * as Location from "expo-location";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
export default function Mapview({ navigation, route }) {
  const { location, setLocation, token } = useContext(AppContext);
  const { courseItem } = route.params;
  const [lectureDescription, setLectureDescription] = useState("");
  const [lectureLocation, setLectureLocation] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const showDialog = () => setIsDialogVisible(true);
  const showModal = () => setIsModalVisible(true);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
    flex: 0.1,
    borderRadius: 25,
    margin: 50,
  };
  const hideModal = () => setIsModalVisible(false);

  const hideDialog = () => setIsDialogVisible(false);
  const handleCreateLecture = async () => {
    showModal();

    try {
      await axios(options2);
      hideModal();
      navigation.goBack();
    } catch (error) {
      showDialog();
    }
  };

  const handleUpdateLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }

    let device_location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      distanceInterval: 100,
    });
    setLocation(device_location);
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
      accuracy: location.coords.accuracy,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    },
  };
  return (
    <PaperProvider>
      <View style={styles.container}>
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
            New Lecture - ({courseItem.course_code})
          </Text>
        </View>
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
            marginVertical: 5,
          }}
          activeUnderlineColor="#40cbc3"
          underlineColor="black"
          cursorColor="black"
          onChangeText={(text) => setLectureDescription(text)}
          contentStyle={{ fontFamily: "medium", color: "black" }}
          // onChangeText={(text) => setEmail(text)}
        />
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
            marginVertical: 5,
          }}
          activeUnderlineColor="#40cbc3"
          underlineColor="black"
          cursorColor="black"
          onChangeText={(text) => setLectureLocation(text)}
          contentStyle={{ fontFamily: "medium", color: "black" }}
        />
        <View style={{ flex: 1, marginVertical: 15 }}>
          <Text
            style={{
              fontFamily: "semibold",
              textAlign: "center",
              marginVertical: 10,
              fontSize: 16,
            }}
          >
            Confirm the location below
          </Text>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0001, // Adjust the zoom level here
              longitudeDelta: 0.0001, // Adjust the zoom level here
            }}
            region={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0001,
              longitudeDelta: 0.0001,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
            />
            {/* <Circle
            center={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            radius={location.coords.accuracy} // Adjust the radius as needed
            fillColor="rgba(34, 107, 235, 0.25)"
          /> */}
          </MapView>
        </View>
        <View style={{ flex: 0.5 }}>
          <Pressable style={styles.dismissBtn} onPress={handleUpdateLocation}>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "bold",
                color: "white",
              }}
            >
              UPDATE LOCATION
            </Text>
          </Pressable>
          <Pressable
            style={
              lectureLocation == "" || lectureDescription == ""
                ? styles.greyedOutBtn
                : styles.dismissBtn
            }
            onPress={handleCreateLecture}
            disabled={
              lectureLocation == "" || lectureDescription == "" ? true : false
            }
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: "bold",
                color:
                  lectureLocation === "" || lectureDescription === ""
                    ? "black"
                    : "white",
              }}
            >
              CREATE
            </Text>
          </Pressable>
        </View>
        <Portal>
          <Dialog
            visible={isDialogVisible}
            onDismiss={hideDialog}
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
                An error occurred
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "medium",
                  marginVertical: 5,
                }}
                variant="bodyMedium"
              >
                Please try again.
              </Text>
            </Dialog.Content>
            <Dialog.Actions style={{ alignSelf: "center" }}>
              <Pressable style={styles.dismissBtn} onPress={hideDialog}>
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

          <Modal
            visible={isModalVisible}
            contentContainerStyle={containerStyle}
            dismissable={false}
          >
            <ActivityIndicator animating={true} color="#40cbc3" />
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    // justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f0f0f0",
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
    height: 50,
  },
  headerText: {
    fontFamily: "bold",
    fontSize: 24,
  },
  dismissBtn: {
    width: "80%",
    backgroundColor: "#40cbc3",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 10,
  },
  greyedOutBtn: {
    width: "80%",
    backgroundColor: "#d3d3d3", // Light grey color
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 10,
    opacity: 0.6, // Reduced opacity to visually indicate disabled state
  },
});
