import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  View,
} from "react-native";
import { AppContext } from "../context/AppContext";
import { removeItem } from "../hooks/SecureStore";
import { removeLocalValueFor } from "../hooks/LocalStorage";

const UserInfoList = ({ data }) => {
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{item.label}</Text>
      <Text style={styles.value}>{item.value}</Text>
    </View>
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
  const {
    setToken,
    setUserInfo,
    userInfo,
    staffInfo,
    studentInfo,
    setAttendance,
  } = useContext(AppContext);
  const [isStaff, setIsStaff] = useState(userInfo.is_staff);

  const userData = [
    { label: "First Name", value: userInfo.first_name },
    { label: "Last Name", value: userInfo.last_name },
    { label: "Email", value: userInfo.email },
    {
      label: "Role",
      value: !userInfo.is_superuser && !userInfo.is_staff ? "STUDENT" : "STAFF",
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
      </View>
      <UserInfoList data={userData} navigation={navigation} />
      <Pressable
        style={styles.logoutButton}
        onPress={() => {
          setToken(null);
          setUserInfo(null);
          setAttendance(null);
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
          LOGOUT
        </Text>
      </Pressable>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    width: "100%",
    height: 50,
  },
  logoutButton: {
    width: "100%",
    backgroundColor: "red",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
});
