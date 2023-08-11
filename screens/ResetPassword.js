import { useState } from "react";
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

export default function ResetPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeInputVisible, setCodeInputVisible] = useState(false);
  const [passwordInputVisible, setPasswordInputVisible] = useState(false);
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
    url: `https://qrollease-api-112d897b35ef.herokuapp.com/api/users/forgot_password?email=${email}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const options2 = {
    method: "POST",
    url: "https://qrollease-api-112d897b35ef.herokuapp.com/api/users/reset_password",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    data: {
      email: email,
      code: verificationCode,
    },
  };

  if (password != "") {
    options2.data.password = password;
  }

  const isEmailValid = () => email !== "";
  const isCodeValid = () => verificationCode !== "";

  const handleSendCode = async () => {
    if (isEmailValid()) {
      showModal();
      await axios(options1)
        .then(() => {
          hideModal();
          setCodeInputVisible(true);
        }) // Invoke the hideModal function to hide the modal
        .catch((err) => console.log(err));
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
          setPasswordInputVisible(true);
        }) // Invoke the hideModal function to hide the modal
        .catch(() => {
          showErrorDialog();
          hideModal();
        });
    } else {
      showDialog();
    }
  };
  const handleResetPassword = async () => {
    if (isCodeValid()) {
      showModal();
      await axios(options2)
        .then(() => {
          hideModal();
          showSuccessDialog();
        }) // Invoke the hideModal function to hide the modal
        .catch((err) => console.log(err));
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
              {codeInputVisible && passwordInputVisible
                ? "Resetting Password"
                : codeInputVisible
                ? "Validating Code"
                : "Sending Verification Code Via Email"}
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
                Password Reset Successful
              </Text>
            </View>
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={{ textAlign: "left", fontFamily: "bold" }}
              variant="bodyMedium"
            >
              You can now proceed to log into your account
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={{ alignSelf: "center" }}>
            <Pressable
              style={styles.dismissBtn}
              onPress={() => {
                navigation.navigate("Login");
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  color: "white",
                  fontFamily: "bold",
                }}
              >
                Login
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
        <Text style={styles.logo}>Reset Your Password</Text>
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
            onChangeText={(text) => setEmail(text)}
            contentStyle={{ fontFamily: "medium", color: "black" }}
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

        {passwordInputVisible ? (
          <View style={styles.inputView}>
            <TextInput
              // mode="outlined"
              label={
                <Text
                  style={{
                    fontFamily: "semibold",
                    color: "black",
                    fontSize: 14,
                  }}
                >
                  New Password
                </Text>
              }
              secureTextEntry
              style={styles.inputText}
              // placeholder="Password"
              activeUnderlineColor="#40cbc3"
              underlineColor="black"
              cursorColor="black"
              onChangeText={(text) => setPassword(text)}
              contentStyle={{ fontFamily: "medium", color: "black" }}
            />
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => {
            if (codeInputVisible && passwordInputVisible) {
              handleResetPassword();
            } else if (codeInputVisible) {
              handleVerifyCode();
            } else {
              handleSendCode();
            }
          }}
        >
          <Text style={styles.loginText}>
            {codeInputVisible && passwordInputVisible
              ? "RESET"
              : codeInputVisible
              ? "VERIFY"
              : "SEND CODE"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ width: "100%" }}>
          <Text
            style={{
              fontFamily: "regular",
              marginVertical: 20,
              textAlign: "center",
            }}
            onPress={() => navigation.navigate("Register")}
          >
            Don't have an account yet? Register
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
});
