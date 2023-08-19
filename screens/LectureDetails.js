import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { AppContext } from "../context/AppContext";
import CryptoJS from "crypto-js";
import MapView, { PROVIDER_GOOGLE, Marker, Circle } from "react-native-maps";
export default function LectureDetails({ route, navigation }) {
  const [QR, setQR] = useState("");
  const { lectureItem } = route.params;
  const { lecturesData, location } = useContext(AppContext);
  // const [lectureInfo, setLectureInfo] = useState(
  //   lecturesData[lectureItem.course_code].find((lecture) => lecture.id === 1)
  // );
  const [QRref, setQRref] = useState();
  const [hasPermissions, setHasPermissions] = useState(false);

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
          JSON.stringify(lecture.lecture_secret),

          "ozHwpxU5LosewCDm"
        ).toString()
      );
    };
    console.log("this is the", lecture);

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
          {lectureItem.lecture_description} - {lectureItem.course_code}
          {"   "}
          <Text style={{ color: lectureItem.is_active ? "green" : "red" }}>
            ({lectureItem.is_active ? "In session" : "Closed"})
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
            latitude: 5.74291667,
            longitude: -0.02019444,
            latitudeDelta: 0.001, // Adjust the zoom level here
            longitudeDelta: 0.001, // Adjust the zoom level here
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
      <View style={styles.qr}>
        {QR && (
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
        <TouchableOpacity
          style={{
            marginVertical: 10,
            backgroundColor: "red",
            padding: 12,
            borderRadius: 10,
          }}
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
      </View>
    </View>
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
  qr: {
    alignSelf: "center",
    height: "45%",
    width: 300,
  },
  map: {
    flex: 1,
  },
});
