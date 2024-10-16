import React from "react";
import { Pressable, StyleSheet } from "react-native";

const PressableButton = ({ onPress, children, style }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.5 : 1,
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
};

export default PressableButton;

const styles = StyleSheet.create({});
