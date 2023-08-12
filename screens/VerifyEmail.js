import { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";

import {
  Modal,
  Portal,
  PaperProvider,
  ActivityIndicator,
  Dialog,
  TextInput,
} from "react-native-paper";
import axios from "axios";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { AppContext } from "../context/AppContext";
import { removeItem } from "../hooks/SecureStore";

export default function VerifyEmail({ navigation }) {
  const { userInfo, token, setToken, setUserInfo } = useContext(AppContext);

  const [verificationCode, setVerificationCode] = useState("");
  const [codeInputVisible, setCodeInputVisible] = useState(false);
  const [isSuccessDialogVisible, setIsSuccessDialogVisible] = useState(false);
  const [isErrorDialogVisible, setIsErrorDialogVisible] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const showSuccessDialog = () => setIsSuccessDialogVisible(true);

  const hideSuccessDialog = () => setIsSuccessDialogVisible(false);

  const showErrorDialog = () => setIsErrorDialogVisible(true);

  const hideErrorDialog = () => setIsErrorDialogVisible(false);

  const showDialog = () => setIsDialogVisible(true);

  const showModal = () => setIsModalVisible(true);

  const hideDialog = () => setIsDialogVisible(false);

  const hideModal = () => setIsModalVisible(false);

  const options1 = {
    method: "POST",
    url: "https://qrollease-api-112d897b35ef.herokuapp.com/api/users/send_verification_code",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${JSON.parse(token)} `,
    },
  };
  const options2 = {
    method: "POST",
    url: `https://qrollease-api-112d897b35ef.herokuapp.com/api/users/verify_code?code=${verificationCode}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${JSON.parse(token)} `,
    },
  };

  const isEmailValid = () => userInfo.email !== "";
  const isCodeValid = () => verificationCode !== "";

  const handleSendCode = async () => {
    if (isEmailValid()) {
      showModal();
      await axios(options1).then(() => {
        hideModal();
        setCodeInputVisible(true);
      });
    } else {
      showDialog();
    }
  };

  const handleVerifyCode = async () => {
    if (isCodeValid()) {
      showModal();
      await axios(options2)
        .then(() => {
          hideModal();
          showSuccessDialog();
        }) // Invoke the hideModal function to hide the modal
        .catch((err) => {
          console.log(err);
          showErrorDialog();
          hideModal();
        });
    } else {
      showDialog();
    }
  };

  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}
          dismissable={false}
        >
          <ActivityIndicator animating={true} color="#40cbc3" />
          <Text style={{ fontFamily: "bold" }}>
            <Text style={{ fontFamily: "bold" }}>
              {(() => {
                if (codeInputVisible) {
                  return "Validating Code";
                } else {
                  return "Sending Verification Code Via Email";
                }
              })()}
            </Text>
          </Text>
        </Modal>

        <Dialog
          visible={isSuccessDialogVisible}
          onDismiss={hideSuccessDialog}
          style={{
            backgroundColor: "white",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Dialog.Title style={{ marginVertical: 10 }}>
            <View
              style={{
                flexDirection: "column",

                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <Ionicons name="checkmark-circle-sharp" size={48} color="green" />
              <Text style={{ textAlign: "center", fontFamily: "bold" }}>
                Email Verified
              </Text>
            </View>
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={{ textAlign: "left", fontFamily: "bold" }}
              variant="bodyMedium"
            >
              You can now continue
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={{ alignSelf: "center" }}>
            <Pressable
              style={styles.dismissBtn}
              onPress={() => {
                navigation.navigate("AdInformation");
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  color: "white",
                  fontFamily: "bold",
                }}
              >
                CONTINUE
              </Text>
            </Pressable>
          </Dialog.Actions>
        </Dialog>

        <Dialog
          visible={isDialogVisible}
          onDismiss={hideDialog}
          style={{
            backgroundColor: "white",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Dialog.Title style={{ textAlign: "center" }}>
            <Entypo name="circle-with-cross" size={36} color="red" />
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={{ textAlign: "center", fontFamily: "bold" }}
              variant="bodyMedium"
            >
              Invalid inputs!
            </Text>
            <Text
              style={{
                textAlign: "left",
                fontFamily: "bold",
                marginTop: 15,
              }}
            >
              Note: {"\n"}
              1.All fields are required.{"\n"}
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={{ alignSelf: "center" }}>
            <Pressable style={styles.dismissBtn} onPress={() => hideDialog()}>
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
          visible={isErrorDialogVisible}
          onDismiss={hideErrorDialog}
          style={{
            backgroundColor: "white",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Dialog.Title style={{ textAlign: "center" }}>
            <Entypo name="circle-with-cross" size={36} color="red" />
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={{ textAlign: "center", fontFamily: "bold" }}
              variant="bodyMedium"
            >
              Invalid Verification Code!
            </Text>
            <Text
              style={{
                textAlign: "left",
                fontFamily: "bold",
                marginTop: 15,
              }}
            >
              Crosscheck the verification code and try again
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={{ alignSelf: "center" }}>
            <Pressable
              style={styles.dismissBtn}
              onPress={() => hideErrorDialog()}
            >
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
      <View style={styles.container}>
        <Text style={styles.logo}>Verify your Email</Text>
        <View style={styles.inputView}>
          <TextInput
            label={
              <Text
                style={{ fontFamily: "semibold", color: "black", fontSize: 14 }}
              >
                Email
              </Text>
            }
            style={styles.inputText}
            activeUnderlineColor="#40cbc3"
            underlineColor="black"
            cursorColor="black"
            contentStyle={{ fontFamily: "medium", color: "black" }}
            editable={false}
            selectTextOnFocus={false}
            value={userInfo.email}
          />
        </View>

        {codeInputVisible ? (
          <View style={styles.inputView}>
            <TextInput
              label={
                <Text
                  style={{
                    fontFamily: "semibold",
                    color: "black",
                    fontSize: 14,
                  }}
                >
                  Verification Code (Check Your Inbox)
                </Text>
              }
              style={styles.inputText}
              activeUnderlineColor="#40cbc3"
              underlineColor="black"
              cursorColor="black"
              onChangeText={(text) => setVerificationCode(text)}
              contentStyle={{ fontFamily: "medium", color: "black" }}
            />
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => {
            if (codeInputVisible) {
              handleVerifyCode();
            } else {
              handleSendCode();
            }
          }}
        >
          <Text style={styles.loginText}>
            {(() => {
              if (codeInputVisible) {
                return "VERIFY";
              } else {
                return "SEND CODE";
              }
            })()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            setToken(null);
            setUserInfo(null);
            removeItem("access_token");
            removeItem("email");
            removeItem("password");
            removeLocalValueFor("user_info");
          }}
        >
          <Text
            style={{
              color: "white",
              fontFamily: "bold",
              fontSize: 15,
              textAlign: "center",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontFamily: "bold",
    fontSize: 30,
    color: "#328f8a",
    marginBottom: 40,
  },
  inputView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
    backgroundColor: "white",
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#40cbc3",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: "white",
    fontFamily: "bold",
  },
  dismissBtn: {
    width: "80%",
    backgroundColor: "#40cbc3",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  containerStyle: {
    backgroundColor: "white",
    padding: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
    flex: 0.1,
    borderRadius: 25,
    margin: 50,
  },
  logoutButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "red",
    borderRadius: 10,
  },
});
