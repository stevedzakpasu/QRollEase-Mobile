import { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { AppContext } from "../context/AppContext";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { save } from "../hooks/SecureStore";
import axios from "axios";
import {
  Modal,
  Portal,
  PaperProvider,
  ActivityIndicator,
  Dialog,
  TextInput,
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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isSuccessDialogVisible, setIsSuccessDialogVisible] = useState(false);
  const showDialog = () => setIsDialogVisible(true);

  const hideDialog = () => setIsDialogVisible(false);

  const showSuccessDialog = () => setIsSuccessDialogVisible(true);

  const hideSuccessDialog = () => setIsSuccessDialogVisible(false);

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
          save("email", email);
          save("password", password);
          updateAccessToken();
        })
        .catch((error) => {
          showDialog();
        })
        .finally(() => {
          hideModal();
          showSuccessDialog();
        });
    }
  };

  return (
    <PaperProvider>
      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
          dismissable={false}
        >
          <ActivityIndicator animating={true} color="#40cbc3" />
        </Modal>

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
              style={{ textAlign: "left", fontFamily: "bold" }}
              variant="bodyMedium"
            >
              Crosscheck the info provided and try again
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

        <Dialog
          visible={isSuccessDialogVisible}
          onDismiss={hideSuccessDialog}
          style={{
            backgroundColor: "white",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Dialog.Title style={{ alignSelf: "center" }}></Dialog.Title>
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
                LOGIN
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
                style={{ fontFamily: "semibold", color: "black", fontSize: 14 }}
              >
                First Name
              </Text>
            }
            style={styles.inputText}
            activeUnderlineColor="#40cbc3"
            underlineColor="black"
            cursorColor="black"
            onChangeText={(text) => setFirstName(text)}
            contentStyle={{ fontFamily: "medium", color: "black" }}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            label={
              <Text
                style={{ fontFamily: "semibold", color: "black", fontSize: 14 }}
              >
                Last Name
              </Text>
            }
            style={styles.inputText}
            activeUnderlineColor="#40cbc3"
            underlineColor="black"
            cursorColor="black"
            onChangeText={(text) => setLastName(text)}
            contentStyle={{ fontFamily: "medium", color: "black" }}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            label={
              <Text
                style={{ fontFamily: "semibold", color: "black", fontSize: 14 }}
              >
                University Email
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
            secureTextEntry
            label={
              <Text
                style={{ fontFamily: "semibold", color: "black", fontSize: 14 }}
              >
                Password
              </Text>
            }
            style={styles.inputText}
            activeUnderlineColor="#40cbc3"
            underlineColor="black"
            cursorColor="black"
            onChangeText={(text) => setPassword(text)}
            contentStyle={{ fontFamily: "medium", color: "black" }}
          />
        </View>
        <TouchableOpacity
          style={styles.signUpBtn}
          onPress={handleSignUp}
          disabled={!isInputValid()}
        >
          <Text style={styles.loginText}>SIGN UP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ width: "100%" }}
          onPress={() => navigation.navigate("Login")}
        >
          <Text
            style={{
              fontFamily: "regular",
              marginVertical: 20,
              textAlign: "center",
            }}
          >
            Already a user? Login
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
