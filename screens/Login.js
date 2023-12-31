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
  const { token, setToken, setUserInfo } = useContext(AppContext);
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
  const options1 = {
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

  const handleLogin = async () => {
    showModal();
    await axios(options1)
      .then((response) => {
        save("email", email);
        save("password", password);
        save("access_token", JSON.stringify(response.data.access_token));
        setToken(JSON.stringify(response.data.access_token));
        navigation.navigate("Loading");
      })
      .catch(() => {
        hideModal();
        showDialog();
      });
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
          <Dialog.Title style={{ alignSelf: "center" }}>
            <Entypo name="circle-with-cross" size={36} color="red" />
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={{ textAlign: "center", fontFamily: "bold" }}
              variant="bodyMedium"
            >
              Invalid credentials
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontFamily: "medium",
                marginVertical: 5,
              }}
              variant="bodyMedium"
            >
              No account found for this email and password combination
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
        <View style={styles.inputView}>
          <TextInput
            label={
              <Text
                style={{ fontFamily: "semibold", color: "black", fontSize: 14 }}
              >
                Password
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
        <TouchableOpacity
          disabled={email == "" || password == "" ? true : false}
          style={styles.dismissBtn}
          onPress={handleLogin}
        >
          <Text
            style={{
              color: "white",
              fontFamily: "bold",
            }}
          >
            SIGN IN
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("ResetPassword")}
          style={{ width: "100%" }}
        >
          <Text
            style={{
              fontFamily: "regular",
              marginVertical: 20,
              textAlign: "center",
            }}
          >
            Do you have trouble login in? Reset your password
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ width: "100%" }}
          onPress={() => navigation.navigate("Register")}
        >
          <Text
            style={{
              fontFamily: "regular",
              marginVertical: 20,
              textAlign: "center",
            }}
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
  greyedOutBtn: {
    width: "80%",
    backgroundColor: "#d3d3d3", // Light grey color
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 10,
    opacity: 0.6, // Reduced opacity to visually indicate disabled state
  },
});
