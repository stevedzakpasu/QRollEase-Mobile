import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { Avatar } from "react-native-paper";

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

const Profile = ({ navigation }) => {
  const userData = [
    { label: "Name", value: "John Doe" },
    { label: "Email", value: "johndoe@example.com" },
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
};

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

export default Profile;
