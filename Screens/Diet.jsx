import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";

const Diet = ({ navigation }) => {
  return (
    <View>
      <Text>Diet</Text>
      <Button
        title="Add Diet"
        onPress={() => navigation.navigate("AddDietScreen")}
      />
    </View>
  );
};

export default Diet;

const styles = StyleSheet.create({});
