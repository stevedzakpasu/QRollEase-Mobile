import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Ionicons } from "@expo/vector-icons";
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from "react-native-maps";
import axios from "axios";
import * as Location from "expo-location";

export default function ScanConfirm({ route, navigation }) {
  const { scanResults } = route.params;
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    console.log(distance);
  });

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
    if (distance < 100) {
      await axios(options).then(console.log("attended"));
    } else {
      console.log("too far");
    }
  };
  const { lecturesData, userInfo, token, studentInfo, location, setLocation } =
    useContext(AppContext);
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

    // Calculate the combined accuracy as a radius of the intersection area
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
    // check if the course is part of the courses
    // if it is go to the scan confirm

    //You are about to add your attendance for a lecture with course code .... let's start by adding you to the course) some kind of notice

    // ask to confirm details before making any request
    // check if course is part of courses, if it not make the add course request first
    // check if the location is mocked
    // check the location distance
    // if everything is satisfied, let's goooo
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

        {/* <Text style={styles.headerText}>
          {scanResults.lecture_description} - {scanResults.course_code}
          <Text style={{ color: scanResults.is_active ? "green" : "red" }}>
            ({scanResults.is_active ? "In session" : "Ended"})
          </Text>
        </Text> */}
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
        Status:{" "}
        <Text
          style={{
            fontFamily: "semibold",
            color: scanResults.is_active ? "green" : "red",
          }}
        >
          {scanResults.is_active ? "Ongoing" : "Ended"}
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
      {/* <TouchableOpacity
        style={{
          position: "absolute", // Required for positioning
          zIndex: 1,
          bottom: 55,
          right: 15,
        }}
        // onPress={showDialog}
        >
        <Ionicons name="md-add-circle-sharp" size={48} color="black" />
    </TouchableOpacity> */}
      <View style={{ flex: 1, marginVertical: 15 }}>
        <Text
          style={{ fontFamily: "medium", fontSize: 20, marginVertical: 10 }}
        >
          Confirm your location below
        </Text>

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
          {/* <Circle
            center={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            radius={location.coords.accuracy} // Adjust the radius as needed
            fillColor="rgba(34, 107, 235, 0.25)"
          /> */}
        </MapView>
        <Text style={{ fontFamily: "semibold", fontSize: 12, color: "blue" }}>
          Blue Pin - <Text style={{ color: "black" }}>Your Location</Text>
        </Text>
        <Text style={{ fontFamily: "semibold", fontSize: 12, color: "red" }}>
          Red Pin - <Text style={{ color: "black" }}>Lecture Location</Text>
        </Text>
      </View>
      <View style={{ flex: 0.5 }}>
        <TouchableOpacity
          style={{ backgroundColor: "red", padding: 10, marginVertical: 10 }}
          onPress={handleUpdateLocation}
        >
          <Text style={{ textAlign: "center" }}>Update My Location</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: "red", padding: 10, marginVertical: 10 }}
          onPress={handleAttendLecture}
        >
          <Text style={{ textAlign: "center" }}>Proceed </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    // justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    width: "100%",
    height: "5%",
  },
});
