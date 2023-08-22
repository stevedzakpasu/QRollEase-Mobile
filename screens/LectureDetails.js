import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { AppContext } from "../context/AppContext";
import CryptoJS from "crypto-js";
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from "react-native-maps";
import axios from "axios";
export default function LectureDetails({ route, navigation }) {
  const [QR, setQR] = useState("");
  const { lectureItem } = route.params;
  const { lecturesData, location, userInfo, token } = useContext(AppContext);
  // const [lectureInfo, setLectureInfo] = useState(
  //   lecturesData[lectureItem.course_code].find((lecture) => lecture.id === 1)
  // );

  const [QRref, setQRref] = useState();
  const [hasPermissions, setHasPermissions] = useState(false);
  const options = {
    method: "PUT",
    url: `https://qrollease-api-112d897b35ef.herokuapp.com/api/lectures?lecture_id=${lectureItem.id}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${JSON.parse(token)} `,
      "Content-Type": "application/json",
    },
    data: {
      is_active: false,
    },
  };
  const handleEndSession = async () => {
    await axios(options);
  };
  useEffect(() => {
    (async () => {
      setHasPermissions((await MediaLibrary.requestPermissionsAsync()).granted);
    })();
  }, []);

  const [lecture, setLecture] = useState(
    lecturesData[lectureItem.course_code].find(
      (lecture) =>
        lecture.lecture_description === lectureItem.lecture_description
    )
  );
  useEffect(() => {
    const generateQRCode = () => {
      setQR(
        CryptoJS.AES.encrypt(
          JSON.stringify(lecture),

          "ozHwpxU5LosewCDm"
        ).toString()
      );
    };

    generateQRCode();
  }, []);
  const saveQRCode = () => {
    if (!hasPermissions || !QRref) return;

    QRref.toDataURL(async (data) => {
      const QRCodeImg = FileSystem.documentDirectory + "QRCode.png";
      await FileSystem.writeAsStringAsync(QRCodeImg, data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      MediaLibrary.saveToLibraryAsync(QRCodeImg);
    });
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
          {lectureItem.lecture_description} - {lectureItem.course_code}
          {"   "}
          <Text style={{ color: lectureItem.is_active ? "green" : "red" }}>
            ({lectureItem.is_active ? "In session" : "Ended"})
          </Text>
        </Text>
      </View>

      <Text style={{ fontFamily: "regular", fontSize: 20 }}>
        Created on:{" "}
        <Text style={{ fontFamily: "semibold" }}>
          {new Date(lectureItem.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Text>
      </Text>
      {lectureItem.updated_at ? (
        <Text style={{ fontFamily: "regular", fontSize: 20 }}>
          Last updated on:{" "}
          <Text style={{ fontFamily: "semibold" }}>
            {new Date(lectureItem.updated_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </Text>
      ) : (
        <Text style={{ fontFamily: "regular", fontSize: 20 }}>
          Last updated on: <Text style={{ fontFamily: "semibold" }}>N/A</Text>
        </Text>
      )}
      <Text style={{ fontFamily: "regular", fontSize: 20 }}>
        Location:{" "}
        <Text style={{ fontFamily: "semibold" }}>
          {lectureItem.lecture_location}
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
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: lectureItem.latitude,
            longitude: lectureItem.longitude,
            latitudeDelta: 0.001, // Adjust the zoom level here
            longitudeDelta: 0.001, // Adjust the zoom level here
          }}
          region={{
            latitude: lectureItem.latitude,
            longitude: lectureItem.longitude,
            latitudeDelta: 0.001, // Adjust the zoom level here
            longitudeDelta: 0.001, // Adjust the zoom level here
          }}
        >
          <Marker
            coordinate={{
              latitude: lectureItem.latitude,
              longitude: lectureItem.longitude,
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
      <View style={styles.qr}>
        {QR && userInfo.is_staff && (
          <>
            <Text
              style={{
                fontFamily: "bold",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Unique QR for this lecture {"\n"} (Tap to save to device)
            </Text>
            <QRCode
              size={300}
              value={QR}
              getRef={setQRref}
              backgroundColor="#fff"
            />
          </>
        )}

        {QR && userInfo.is_staff && lectureItem.is_active && (
          <TouchableOpacity
            style={{
              marginVertical: 10,
              backgroundColor: "red",
              padding: 12,
              borderRadius: 10,
            }}
            onPress={handleEndSession}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontFamily: "bold",
                fontSize: 15,
              }}
            >
              End Session
            </Text>
          </TouchableOpacity>
        )}
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
