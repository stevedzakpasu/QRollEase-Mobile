import { StyleSheet, Text, View } from "react-native";
import { useEffect, useContext } from "react";
import axios from "axios";
import { saveLocally } from "../hooks/LocalStorage";
import { AppContext } from "../context/AppContext";
import { ActivityIndicator } from "react-native-paper";

export default function Loading({ navigation }) {
  const { token, setUserInfo } = useContext(AppContext);
  const options = {
    method: "GET",
    url: "https://qrollease-api-112d897b35ef.herokuapp.com/api/users/me",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${JSON.parse(token)} `,
    },
  };
  useEffect(() => {
    const getUserInfo = async () => {
      await axios(options).then((response) => {
        saveLocally("user_info", JSON.stringify(response.data));
        setUserInfo(response.data);
      });
    };

    getUserInfo();
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator animating={true} color="#40cbc3" />

      <Text style={{ fontFamily: "bold", marginVertical: 15, fontSize: 24 }}>
        Just a moment
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
