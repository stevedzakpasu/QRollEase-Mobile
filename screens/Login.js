import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { save } from "../hooks/SecureStore";

import axios from "axios";
import { AppContext } from "../context/AppContext";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { token, setToken } = useContext(AppContext);
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

  const handleLogin = () => {
    axios(options)
      .then((response) => {
        save("access_token", JSON.stringify(response.data));
        setToken(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.logo}>Log Into Your Account</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            placeholder="Email"
            placeholderTextColor="#003f5c"
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            secureTextEntry
            style={styles.inputText}
            placeholder="Password"
            placeholderTextColor="#003f5c"
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>SIGN IN</Text>
        </TouchableOpacity>
        <Text onPress={() => navigation.navigate("Register")}>
          Don't have an account yet? Register
        </Text>
      </View>
    </>
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
    fontWeight: "bold",
    fontSize: 30,
    color: "#40cbc3",
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
  },
});
