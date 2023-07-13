import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Text
        style={{
          fontSize: 50,
          fontFamily: "medium",
          color: "#328f8a",
        }}
      >
        Home
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
