import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "axios";
import CryptoJS from "crypto-js";
import { AppContext } from "../context/AppContext";
export default function Scanner({ navigation }) {
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

    setScanned(true);

    if (scanResults.lecture_secret) {
      navigation.navigate("ScanConfirm", { scanResults });
      // set scanned to false
    }

    // else it means the qr code was not recognized
    // show a pop up that on confirmation sets scanned to false

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
