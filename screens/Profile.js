import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppContext } from "../context/AppContext";
import { removeItem } from "../hooks/SecureStore";
import { removeLocalValueFor } from "../hooks/LocalStorage";

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
  const { setToken, setUserInfo, userInfo, staffInfo, studentInfo } =
    useContext(AppContext);
  const [isStaff, setIsStaff] = useState(userInfo.is_staff);

  const userData = [
    { label: "First Name", value: userInfo.first_name },
    { label: "Last Name", value: userInfo.last_name },
    { label: "Email", value: userInfo.email },
    {
      label: "Role",
      value: !userInfo.is_superuser && !userInfo.is_staff ? "Student" : "Staff",
    },
    {
      label: isStaff ? "Staff ID" : "Student ID",
      value: isStaff ? staffInfo.staff_id : studentInfo.student_id,
    },
    {
      label: isStaff ? "Department" : "Programme",
      value: isStaff ? staffInfo.department : studentInfo.programme,
    },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
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

      <UserInfoList data={userData} navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },

  row: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  label: {
    fontSize: 16,
    fontFamily: "semibold",
  },
  value: {
    fontSize: 16,
    fontFamily: "regular",
  },

  headerText: {
    fontSize: 24,
    fontFamily: "bold",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logoutButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "red",
    borderRadius: 10,
  },
});
