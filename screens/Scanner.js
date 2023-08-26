import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import CryptoJS from "crypto-js";
import { useIsFocused } from "@react-navigation/native";
import { Button, Dialog, Portal, PaperProvider } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
export default function Scanner({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const isFocused = useIsFocused();
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const handleBarCodeScanned = async ({ type, data }) => {
    try {
      const bytes = CryptoJS.AES.decrypt(data, "ozHwpxU5LosewCDm");
      const scanResults = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setScanned(true);

      if (scanResults.lecture_secret) {
        setScanned(false);
        navigation.navigate("ScanConfirm", { scanResults });
      }
    } catch (error) {
      showDialog();
    }
  };

  if (hasPermission === null) {
    return null;
  }
  if (hasPermission === false) {
    return null;
  }

  return (
    <PaperProvider>
      <View style={styles.container}>
        {isFocused ? (
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        ) : null}
      </View>
      <Portal>
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
              variant="bodyMedium"
            >
              The QR code was not recognized
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
      </Portal>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  dismissBtn: {
    width: "80%",
    backgroundColor: "#40cbc3",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
