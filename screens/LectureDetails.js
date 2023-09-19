import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  ToastAndroid,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { AppContext } from "../context/AppContext";
import CryptoJS from "crypto-js";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import axios from "axios";
import { Entypo } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Dialog,
  Modal,
  PaperProvider,
  Portal,
} from "react-native-paper";

export default function LectureDetails({ route, navigation }) {
  const [QR, setQR] = useState("");
  const { lectureItem } = route.params;
  const { lecturesData, location, userInfo, token } = useContext(AppContext);
  const [sessionEnded, setSessionEnded] = useState(!lectureItem.is_active);

  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
    flex: 0.1,
    borderRadius: 25,
    margin: 50,
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const showDialog = () => setIsDialogVisible(true);
  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);
  const hideDialog = () => setIsDialogVisible(false);
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
    hideDialog();
    showModal();
    await axios(options);
    setSessionEnded(true);
    hideModal();
  };

  const [lecture, setLecture] = useState(
    lecturesData[lectureItem.course_code].find(
      (lecture) => lecture.lecture_secret === lectureItem.lecture_secret
    )
  );
  useEffect(() => {
    (async () => {
      setHasPermissions((await MediaLibrary.requestPermissionsAsync()).granted);
    })();
  }, []);
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
  }, [sessionEnded]);

  const saveQRCode = () => {
    if (!hasPermissions || !QRref) return;

    QRref.toDataURL(async (data) => {
      const QRCodeImg =
        FileSystem.documentDirectory +
        `${lectureItem.course_code}-${lectureItem.lecture_description}-QRCode.png`;
      await FileSystem.writeAsStringAsync(QRCodeImg, data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      MediaLibrary.saveToLibraryAsync(QRCodeImg)
        .then(() =>
          ToastAndroid.show("QR Code saved to gallery", ToastAndroid.LONG)
        )
        .catch(console.error);
    });
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
            {lectureItem.lecture_description} - {lectureItem.course_code}
            {"   "}
            <Text style={{ color: !sessionEnded ? "green" : "red" }}>
              ({!sessionEnded ? "In session" : "Ended"})
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
          </MapView>
        </View>

        <View style={styles.qr}>
          {QR && userInfo.is_staff && (
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontFamily: "bold",
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                Unique QR for this lecture {"\n"} (Tap to save to device)
              </Text>
              <Pressable onPress={saveQRCode}>
                <QRCode
                  size={300}
                  value={QR}
                  getRef={setQRref}
                  backgroundColor="#fff"
                />
              </Pressable>
              {!sessionEnded ? (
                <TouchableOpacity
                  style={{
                    marginVertical: 10,
                    backgroundColor: "red",
                    padding: 12,
                    borderRadius: 10,
                    width: "100%",
                  }}
                  onPress={showDialog}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: "white",
                      fontFamily: "bold",
                      fontSize: 15,
                    }}
                  >
                    END SESSION
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    marginVertical: 10,
                    backgroundColor: "#40cbc3",
                    padding: 12,
                    borderRadius: 10,
                    width: "100%",
                  }}
                  onPress={() => {
                    navigation.navigate("AttendanceView", {
                      lectureItem: lectureItem,
                    });
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
                    VIEW ATTENDANCE
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
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
                Are you sure you want to end this lecture?{"\n"} This action is
                irreversible!
              </Text>
            </Dialog.Content>
            <Dialog.Actions
              style={{
                alignSelf: "center",
                flexDirection: "column",

                width: "100%",
              }}
            >
              <Pressable style={styles.dismissBtn} onPress={hideDialog}>
                <Text
                  style={{
                    alignSelf: "center",
                    color: "white",
                    fontFamily: "bold",
                  }}
                >
                  GO BACK
                </Text>
              </Pressable>

              <Pressable
                style={{
                  width: "80%",
                  backgroundColor: "red",
                  borderRadius: 25,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  marginVertical: 10,
                }}
                onPress={handleEndSession}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    color: "white",
                    fontFamily: "bold",
                  }}
                >
                  END SESSION
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
});
