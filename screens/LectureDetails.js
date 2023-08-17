import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { AppContext } from "../context/AppContext";
import CryptoJS from "crypto-js";
export default function LectureDetails({ route, navigation }) {
  const [QR, setQR] = useState("");
  const { lectureItem } = route.params;
  const { lecturesData } = useContext(AppContext);
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
          JSON.stringify(lecture),

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
        </Text>
      </View>
      <Text>Date</Text>
      <Text>Location</Text>
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
      <View style={styles.qr}>
        {QR && (
          <QRCode
            size={240}
            value={QR}
            getRef={setQRref}
            backgroundColor="#fff"
          />
        )}
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
    alignItems: "center",
    justifyContent: "center",
    height: 250,
    width: 250,
  },
});
