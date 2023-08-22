import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from "react-native-maps";
import { TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import axios from "axios";
export default function Mapview({ navigation, route }) {
  const { location, setLocation, token } = useContext(AppContext);
  const { courseItem } = route.params;
  const [lectureDescription, setLectureDescription] = useState("");
  const [lectureLocation, setLectureLocation] = useState("");

  const handleCreateLecture = async () => {
    // if (isInputValid()) {
    //   hideDialog();
    //   showModal();
    await axios(options2);
    //   hideModal();
    // } else {
    // error handling
    // showErrorDialog();
    // }
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
        }}
        activeUnderlineColor="#40cbc3"
        underlineColor="black"
        cursorColor="black"
        onChangeText={(text) => setLectureLocation(text)}
        contentStyle={{ fontFamily: "medium", color: "black" }}
      />
      <View style={{ flex: 1, marginVertical: 15 }}>
        <Text>Confirm the location below</Text>
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
        <TouchableOpacity
          style={{ backgroundColor: "red", padding: 10, marginVertical: 10 }}
          onPress={handleUpdateLocation}
        >
          <Text style={{ textAlign: "center" }}>Update Location</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: "red", padding: 10, marginVertical: 10 }}
          onPress={handleCreateLecture}
        >
          <Text style={{ textAlign: "center" }}>Create </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    height: "5%",
  },
  headerText: {
    fontFamily: "bold",
    fontSize: 24,
  },
});
