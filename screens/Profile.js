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

const apiUrl = "https://qrollease-api-112d897b35ef.herokuapp.com/api/users/me";

const apiUrl2 =
  "https://qrollease-api-112d897b35ef.herokuapp.com/api/students/me";

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
  const [loading, setLoading] = useState(true);

  const [userInfo, setUserInfo] = useState({
    first_name: "Loading",
    last_name: "Loading",
    email: "Loading",
    role: "Loading",
  });

  const [studentInfo, setStudentInfo] = useState({
    student_id: "Loading",
    programme: "Loading",
  });

  useEffect(() => {
    async function fetchData() {
      const options1 = {
        method: "GET",
        url: apiUrl,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      const options2 = {
        method: "GET",
        url: apiUrl2,
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };

      try {
        // Use Promise.all to wait for both promises to be resolved
        const [userInfoResponse, studentInfoResponse] = await Promise.all([
          axios(options1),
          axios(options2),
        ]);

        setUserInfo(userInfoResponse.data);
        setStudentInfo(studentInfoResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    fetchData();
  }, []);

  const userData = [
    { label: "First Name", value: userInfo.first_name },
    { label: "Last Name", value: userInfo.last_name },
    { label: "Email", value: userInfo.email },
    {
      label: "Role",
      value:
        !loading && !userInfo.is_superuser && !userInfo.is_staff
          ? "Student"
          : userInfo.role,
    },
    { label: "Student ID", value: studentInfo.student_id },
    { label: "Programme", value: studentInfo.programme },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity style={styles.logoutButton}>
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
