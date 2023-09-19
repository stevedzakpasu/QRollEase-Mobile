import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from "react-native-maps";
import axios from "axios";
import * as Location from "expo-location";
import {
  PaperProvider,
  Portal,
  Dialog,
  Modal,
  ActivityIndicator,
} from "react-native-paper";
import { Feather } from "@expo/vector-icons";

export default function ScanConfirm({ route, navigation }) {
  const {
    token,
    studentInfo,
    location,
    setLocation,
    attendance,
    setAttendance,
  } = useContext(AppContext);
  const { scanResults } = route.params;
  const [distance, setDistance] = useState(null);
  const [visible, setVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
    flex: 0.1,
    borderRadius: 25,
    margin: 50,
  };
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const showSuccessDialog = () => setSuccessVisible(true);
  const hideSuccessDialog = () => setSuccessVisible(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);

  const hasAttended = () => {
    return attendance.some((item) => item.lecture_id === scanResults.id);
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

  const handleAttendLecture = async () => {
    try {
      showModal();
      await handleAddCourse();
      await axios(options);
      hideModal();
      showSuccessDialog();
    } catch (error) {
      hideModal();
      showDialog();
    }
  };

  const handleAddCourse = async () => {
    try {
      await axios(options2);
    } catch (error) {
      console.error("error occurred");
    }
  };

  function calculateDistanceWithAccuracy(
    lat1,
    lon1,
    accuracy1,
    lat2,
    lon2,
    accuracy2
  ) {
    const R = 6371000; // Earth's radius in meters
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(degToRad(lat1)) *
        Math.cos(degToRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters

    const combinedAccuracy = Math.sqrt(
      Math.pow(accuracy1, 2) + Math.pow(accuracy2, 2)
    );

    return {
      distance: distance,
      combinedAccuracy: combinedAccuracy,
    };
  }

  function degToRad(deg) {
    return deg * (Math.PI / 180);
  }

  useEffect(() => {
    const result = calculateDistanceWithAccuracy(
      location.coords.latitude,
      location.coords.longitude,
      location.coords.accuracy,
      scanResults.latitude,
      scanResults.longitude,
      scanResults.accuracy
    );

    setDistance(result.distance);
  }, [location]);

  const options = {
    method: "POST",
    url: `https://qrollease-api-112d897b35ef.herokuapp.com/api/students-attendances`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(token)} `,
    },
    data: {
      student_id: studentInfo.student_id,
      lecture_secret: scanResults.lecture_secret,
      lecture_id: scanResults.id,
    },
  };

  const options2 = {
    method: "POST",
    url: `https://qrollease-api-112d897b35ef.herokuapp.com/api/students/me/courses/add?course_code=${scanResults.course_code}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(token)} `,
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
          <Text style={styles.headerText}>Lecture Information</Text>
        </View>

        <Text style={{ fontFamily: "regular", fontSize: 20 }}>
          Course code:{" "}
          <Text style={{ fontFamily: "semibold" }}>
            {scanResults.course_code}
          </Text>
        </Text>
        <Text style={{ fontFamily: "regular", fontSize: 20 }}>
          Lecture description:{" "}
          <Text style={{ fontFamily: "semibold" }}>
            {scanResults.lecture_description}
          </Text>
        </Text>

        <Text style={{ fontFamily: "regular", fontSize: 20 }}>
          Created on:{" "}
          <Text style={{ fontFamily: "semibold" }}>
            {new Date(scanResults.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </Text>

        <Text style={{ fontFamily: "regular", fontSize: 20 }}>
          Location:{" "}
          <Text style={{ fontFamily: "semibold" }}>
            {scanResults.lecture_location}
          </Text>
        </Text>

        <View style={{ flex: 1, marginVertical: 15 }}>
          {!hasAttended() ? (
            <>
              <Text
                style={{
                  fontFamily: "medium",
                  fontSize: 16,
                  marginVertical: 10,
                }}
              >
                You are currently{" "}
                <Text style={{ fontFamily: "bold" }}>
                  {distance ? distance.toFixed(2) : "..."}
                </Text>{" "}
                meters.
                {"\n"}Up to <Text style={{ fontFamily: "bold" }}>100</Text>{" "}
                meters distance is allowed to proceed.
              </Text>
            </>
          ) : (
            <Text
              style={{
                fontFamily: "semibold",
                marginVertical: 15,
                textAlign: "center",
                color: "red",
              }}
            >
              YOU HAVE ALREADY ATTENDED THIS LECTURE
            </Text>
          )}

          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.001, // Adjust the zoom level here
              longitudeDelta: 0.001, // Adjust the zoom level here
            }}
            region={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.001, // Adjust the zoom level here
              longitudeDelta: 0.001, // Adjust the zoom level here
            }}
          >
            <Marker
              coordinate={{
                latitude: scanResults.latitude,
                longitude: scanResults.longitude,
              }}
              title="Lecture Location"
              description="This is where the lecture is ongoing"
              pinColor="red" // You can use a color name or a hex color code
            />

            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your location"
              description="This is where you are"
              pinColor="blue" // You can use a color name or a hex color code
            />
          </MapView>
          <Text style={{ fontFamily: "semibold", fontSize: 12, color: "blue" }}>
            Blue Pin - <Text style={{ color: "black" }}>Your Location</Text>
          </Text>
          <Text style={{ fontFamily: "semibold", fontSize: 12, color: "red" }}>
            Red Pin - <Text style={{ color: "black" }}>Lecture Location</Text>
          </Text>
        </View>
        <View style={{ flex: 0.5 }}>
          {!hasAttended() ? (
            <View>
              <Pressable
                style={styles.dismissBtn}
                onPress={handleUpdateLocation}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontFamily: "bold",
                  }}
                >
                  UPDATE MY LOCATION
                </Text>
              </Pressable>
              <Pressable
                style={
                  !distance || distance > 100 || !scanResults.is_active
                    ? styles.greyedOutBtn
                    : styles.dismissBtn
                }
                onPress={handleAttendLecture}
                disabled={
                  !!(
                    !distance ||
                    distance > 100 ||
                    !scanResults.is_active ||
                    location.mocked
                  )
                }
              >
                <Text
                  style={{
                    textAlign: "center",
                    color:
                      !distance || distance > 100 || !scanResults.is_active
                        ? "black"
                        : "white",
                    fontFamily: "bold",
                  }}
                >
                  PROCEED{" "}
                </Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </View>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
          dismissable={false}
        >
          <ActivityIndicator animating={true} color="#40cbc3" />
        </Modal>

        <Dialog
          visible={visible}
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
              style={{
                textAlign: "center",
                fontFamily: "medium",
                marginVertical: 5,
              }}
            >
              There was an error while recording your attendance. {"\n"}
              Please try scanning the code again.
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

        <Dialog
          visible={successVisible}
          onDismiss={hideSuccessDialog}
          style={{
            backgroundColor: "white",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Dialog.Title style={{ alignSelf: "center" }}>
            <Feather name="user-check" size={36} color="green" />
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={{ textAlign: "center", fontFamily: "bold" }}
              variant="bodyMedium"
            >
              Your attendance has been recorded.
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "medium",
                marginVertical: 5,
              }}
              variant="bodyMedium"
            >
              You can now continue.
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={{ alignSelf: "center" }}>
            <Pressable
              style={styles.dismissBtn}
              onPress={() => navigation.navigate("Course")}
            >
              <Text
                style={{
                  alignSelf: "center",
                  color: "white",
                  fontFamily: "bold",
                }}
              >
                GOTCHA!
              </Text>
            </Pressable>
          </Dialog.Actions>
        </Dialog>
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
    width: "100%",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  qr: {
    alignSelf: "center",
    height: "45%",
    width: 300,
  },
  map: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    width: "100%",
    height: 50,
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

    opacity: 0.6, // Reduced opacity to visually indicate disabled state
  },
});
