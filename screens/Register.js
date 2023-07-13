import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { AppContext } from "../context/AppContext";
import { TextInput } from "react-native-paper";

import { Entypo } from "@expo/vector-icons";
import { save } from "../hooks/SecureStore";

import axios from "axios";
import {
  Modal,
  Portal,
  PaperProvider,
  ActivityIndicator,
  Dialog,
} from "react-native-paper";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { updateAccessToken } = useContext(AppContext);
  const data = {
    first_name: firstName,
    last_name: lastName,
    email: email,
    password: password,
  };

  const [isModalvisible, setIsModalVisible] = useState(false);
  const [isDialogvisible, setIsDialogVisible] = useState(false);

  const showDialog = () => setIsDialogVisible(true);

  const hideDialog = () => setIsDialogVisible(false);

  const showModal = () => setIsModalVisible(true);

  const hideModal = () => setIsModalVisible(false);

  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
    flex: 0.1,
    borderRadius: 25,
    margin: 50,
  };

  const isValidEmail = (email) => {
    const emailRegex =
      /^[^\s@]+@(ug\.edu\.gh|st\.ug\.edu\.gh|staff\.ug\.edu\.gh)$/;
    return emailRegex.test(email);
  };

  const options = {
    method: "POST",
    url: "http://qrollease-api-112d897b35ef.herokuapp.com/api/users/open",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
  };
  const isInputValid = () =>
    isValidEmail(email) &&
    password !== "" &&
    firstName !== "" &&
    lastName !== "";

  const handleSignUp = () => {
    if (isInputValid()) {
      showModal();
      axios(options)
        .then((response) => {
          console.log(response.data);
          save("email", email);
          save("password", password);
          updateAccessToken();
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(hideModal);
    } else {
      showDialog();
    }
  };

  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={isModalvisible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
          dismissable={false}
        >
          <ActivityIndicator animating={true} color="#40cbc3" />
          <Text>Sign up in progress</Text>
        </Modal>

        <Dialog
          visible={isDialogvisible}
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
              style={{ textAlign: "left", fontFamily: "bold" }}
              variant="bodyMedium"
            >
              Note: {"\n"}
              1.All fields are required.{"\n"}
              2. Only University of Ghana email addresses are accepted.
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
      <View style={styles.container}>
        <Text style={styles.logo}>Create A New Account</Text>
        <View style={styles.inputView}>
          <TextInput
            label={
              <Text
                style={{ fontFamily: "bold", color: "black", fontSize: 14 }}
              >
                First Name
              </Text>
            }
            style={styles.inputText}
            activeUnderlineColor="transparent"
            underlineColor="transparent"
            cursorColor="black"
            onChangeText={(text) => setFirstName(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            label={
              <Text
                style={{ fontFamily: "bold", color: "black", fontSize: 14 }}
              >
                Last Name
              </Text>
            }
            style={styles.inputText}
            activeUnderlineColor="transparent"
            underlineColor="transparent"
            cursorColor="black"
            onChangeText={(text) => setLastName(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            label={
              <Text
                style={{ fontFamily: "bold", color: "black", fontSize: 14 }}
              >
                University Email
              </Text>
            }
            style={styles.inputText}
            activeUnderlineColor="transparent"
            underlineColor="transparent"
            cursorColor="black"
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            secureTextEntry
            label={
              <Text
                style={{ fontFamily: "bold", color: "black", fontSize: 14 }}
              >
                Password
              </Text>
            }
            style={styles.inputText}
            activeUnderlineColor="transparent"
            underlineColor="transparent"
            cursorColor="black"
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
          <Text style={styles.loginText}>SIGN UP</Text>
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "semibold" }}
          onPress={() => navigation.navigate("Login")}
        >
          Already a user? Login
        </Text>
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
    backgroundColor: "#e6e6e6",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
  },
  inputText: {
    height: 50,
    color: "black",
    backgroundColor: "#e6e6e6",
    fontFamily: "bold",
  },
  signUpBtn: {
    width: "80%",
    backgroundColor: "#40cbc3",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  dismissBtn: {
    width: "80%",
    backgroundColor: "#40cbc3",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: {
    color: "white",
    fontFamily: "bold",
  },
});
