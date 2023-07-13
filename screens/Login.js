import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { save } from "../hooks/SecureStore";
import { TextInput } from "react-native-paper";
import {
  Modal,
  Portal,
  PaperProvider,
  ActivityIndicator,
  Dialog,
} from "react-native-paper";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { Entypo } from "@expo/vector-icons";
export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { token, setToken } = useContext(AppContext);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    justifyContent: "space-evenly",
    alignItems: "center",
    flex: 0.1,
    borderRadius: 25,
    margin: 50,
  };
  const [isModalvisible, setIsModalVisible] = useState(false);
  const [isDialogvisible, setIsDialogVisible] = useState(false);

  const showDialog = () => setIsDialogVisible(true);

  const hideDialog = () => setIsDialogVisible(false);

  const showModal = () => setIsModalVisible(true);

  const hideModal = () => setIsModalVisible(false);
  const options = {
    method: "POST",
    url: "http://qrollease-api-112d897b35ef.herokuapp.com/api/login/access-token",
    headers: {
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      grant_type: "",
      username: email,
      password: password,
      scope: "",
      client_id: "",
      client_secret: "",
    },
  };

  const isValidEmail = (email) => {
    const emailRegex =
      /^[^\s@]+@(ug\.edu\.gh|st\.ug\.edu\.gh|staff\.ug\.edu\.gh)$/;
    return emailRegex.test(email);
  };
  const isInputValid = () => email !== "" && password !== "";

  const handleLogin = () => {
    if (isInputValid()) {
      showModal();
      axios(options)
        .then((response) => {
          save("email", email);
          save("password", password);
          save("access_token", JSON.stringify(response.data));
          setToken(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
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
          <Text style={{ fontFamily: "bold" }}>Login in progress</Text>
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
        <Text style={styles.logo}>Log Into Your Account</Text>
        <View style={styles.inputView}>
          <TextInput
            label={
              <Text style={{ fontFamily: "bold", color: "black" }}>Email</Text>
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
            // mode="outlined"
            label={
              <Text style={{ fontFamily: "bold", color: "black" }}>
                Password
              </Text>
            }
            secureTextEntry
            style={styles.inputText}
            // placeholder="Password"
            activeUnderlineColor="transparent"
            underlineColor="transparent"
            cursorColor="black"
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>SIGN IN</Text>
        </TouchableOpacity>
        <Text
          style={{ fontFamily: "semibold" }}
          onPress={() => navigation.navigate("Register")}
        >
          Don't have an account yet? Register
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
});
