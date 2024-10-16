import { StyleSheet, View, Text } from "react-native";
import React from "react";
import { useTheme } from "../context/ThemeContext";
import colors from "../styles/colors";
import PressableButton from "../Components/PressableButton";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <PressableButton style={styles.button} onPress={toggleTheme}>
        <Text style={styles.text}>Toggle Theme</Text>
      </PressableButton>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
  button: {
    padding: 10,
    backgroundColor: colors.primaryBg,
    borderRadius: 5,
  },
  text: {
    color: colors.lightText,
  },
});
