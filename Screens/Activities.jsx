import React, { useContext, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { ActivityContext } from "../context/ActivityContext";
import ItemsList from "../Components/ItemsList";
import { useTheme } from "../context/ThemeContext";
import PressableButton from "../Components/PressableButton";

const Activities = ({ navigation }) => {
  const { activities } = useContext(ActivityContext);
  const { theme } = useTheme();

  // headerRight button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <PressableButton
          onPress={() => navigation.navigate("AddActivitiesScreen")}
        >
          <Text style={styles.header}>Add</Text>
        </PressableButton>
      ),
    });
  }, [navigation, theme]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <ItemsList items={activities} type="activity" />
    </View>
  );
};

export default Activities;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 20,
  },
});
