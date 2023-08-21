import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "axios";
import CryptoJS from "crypto-js";
import { AppContext } from "../context/AppContext";
export default function Scanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { token, studentInfo } = useContext(AppContext);
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    const bytes = CryptoJS.AES.decrypt(data, "ozHwpxU5LosewCDm");
    const scanResults = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
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
    setScanned(true);
    await axios(options2);
    await axios(options);

    // show a modal until the request is made

    // show appropriate pop up for each case

    // attendance made successfully

    // qr code error

    // already attended

    // setscanned to false idk
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? null : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {/* {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});
