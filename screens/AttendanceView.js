import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { DataTable } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { AppContext } from "../context/AppContext";

export default function AttendanceView({ route, navigation }) {
  const { token, attendance, setAttendance } = useContext(AppContext);
  const { lectureItem } = route.params;
  const [loading, setLoading] = useState(true);

  const options = {
    method: "GET",
    url: `https://qrollease-api-112d897b35ef.herokuapp.com/api/attendances/${lectureItem.lecture_secret}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  };

  const options2 = {
    method: "GET",
    url: `https://qrollease-api-112d897b35ef.herokuapp.com/api/generate_and_send_excel/${lectureItem.lecture_secret}?name=${lectureItem.course_code} - ${lectureItem.lecture_description}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  };

  const fetchAttendance = async () => {
    try {
      const response = await axios(options);

      if (response.status === 200) {
        setAttendance(response.data);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendAttendance = async () => {
    try {
      const response = await axios(options2);

      if (response.status === 200) {
        console.log("success");
        // show a success dialog
      }
    } catch (error) {
      console.error("Error sending attendance:", error);
      // show error dialog
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const renderAttendanceItem = ({ item }) => (
    <View style={styles.attendanceItem}>
      <Text style={{ fontFamily: "bold" }}>{item.student_id}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{ paddingRight: 10, borderRadius: 15 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {lectureItem.lecture_description} - ({lectureItem.course_code}) -
          Attendance
        </Text>
      </View>
      {loading ? (
        <Text>Loading attendance...</Text>
      ) : attendance.length === 0 ? (
        <Text>No attendees yet.</Text>
      ) : (
        <View>
          <Pressable
            style={{
              backgroundColor: "#40cbc3",
              padding: 15,
              borderRadius: 25,
              marginVertical: 15,
            }}
            onPress={sendAttendance}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
                fontFamily: "bold",
              }}
            >
              {" "}
              SEND VIA EMAIL
            </Text>
          </Pressable>
          <Text style={{ fontFamily: "medium" }}>
            Total Attendees: {attendance.length}
          </Text>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Student ID</DataTable.Title>
            </DataTable.Header>
            {attendance.map((item) => (
              <DataTable.Row key={item.student_id}>
                <DataTable.Cell>{item.student_id}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: {
    fontFamily: "bold",
    fontSize: 24,
  },
  container: {
    flex: 1,
    width: "100%",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    width: "100%",
    height: "5%",
  },
  attendanceItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 15,
  },
});
