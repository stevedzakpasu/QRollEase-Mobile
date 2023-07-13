import {
  Button,
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function Welcome({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-evenly",
      }}
    >
      <Text
        style={{
          textAlign: "center",
          fontSize: 50,
          fontFamily: "medium",
          color: "#328f8a",
        }}
      >
        All Attendance{"\n"}In One Place
      </Text>
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require("../assets/images/welcome_screen.jpg")}
        />
      </View>
      <Text
        style={{ textAlign: "center", fontSize: 25, fontFamily: "semibold" }}
      >
        Track & Monitor Your Attendance
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    resizeMode: "contain",
  },

  button: {
    width: "80%",
    backgroundColor: "#40cbc3",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "bold",
  },
});
