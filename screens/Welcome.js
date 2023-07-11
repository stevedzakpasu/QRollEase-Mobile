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
        marginTop: StatusBar.currentHeight,
        flex: 1,
        backgroundColor: "white",
        justifyContent: "space-evenly",
      }}
    >
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require("../assets/images/welcome_screen.jpg")}
        />
      </View>
      <Text style={{ textAlign: "center", fontSize: 50 }}>
        All Attendance In One Place
      </Text>
      <Text style={{ textAlign: "center", fontSize: 25 }}>
        Track & Monitor Attendance
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
    backgroundColor: "#40cbc3",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    margin: 25,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
