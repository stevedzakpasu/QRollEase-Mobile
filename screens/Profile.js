import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar } from "react-native-paper";
import { AppContext } from "../context/AppContext";

const apiUrl = "https://qrollease-api-112d897b35ef.herokuapp.com/api/users/me"; // Replace with your API endpoint

const UserInfoList = ({ data, navigation }) => {
  const handleRowPress = (item) => {
    navigation.navigate("EditScreen", { item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.row} onPress={() => handleRowPress(item)}>
      <Text style={styles.label}>{item.label}</Text>
      <Text style={styles.value}>{item.value}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(_item, index) => index.toString()}
    />
  );
};

export default function Profile({ navigation }) {
  const { token, setToken } = useContext(AppContext);
  const [userInfo, setUserInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  useEffect(() => {
    async function fetchData() {
      const options = {
        method: "GET",
        url: apiUrl,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      await axios(options).then((response) => setUserInfo(response.data));
    }

    fetchData();
  }, []);
  const userData = [
    { label: "First Name", value: userInfo.first_name },
    { label: "Last Name", value: userInfo.last_name },
    { label: "Email", value: userInfo.email },
    // Other user data
  ];
  return (
    <View style={styles.container}>
      <Avatar.Image
        size={200}
        source={require("../assets/images/avatar.png")}
        style={styles.avatar}
      />
      <UserInfoList data={userData} navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  avatar: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
  },
});
