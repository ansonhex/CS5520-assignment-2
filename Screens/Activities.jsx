import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import ItemsList from "../Components/ItemsList";
import { useTheme } from "../context/ThemeContext";
import PressableButton from "../Components/PressableButton";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";

const Activities = ({ navigation }) => {
  const [activities, setActivities] = useState([]);
  const { theme } = useTheme();

  // headerRight button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <PressableButton
          onPress={() => navigation.navigate("AddActivitiesScreen")}
        >
          <View style={styles.header}>
            <AntDesign
              name="plus"
              size={20}
              color="white"
              style={{ paddingRight: 5 }}
            />
            <FontAwesome5 name="running" size={20} color="white" />
          </View>
        </PressableButton>
      ),
    });
  }, [navigation, theme]);

  // read data from Firestore with snapshot
  useEffect(() => {
    let unsubscribe;

    try {
      unsubscribe = onSnapshot(collection(db, "activities"), (snapshot) => {
        const activitiesData = [];
        snapshot.forEach((doc) => {
          activitiesData.push({ id: doc.id, ...doc.data() });
        });
        setActivities(activitiesData);
      });
    } catch (error) {
      console.error("Error reading document: ", error);
    }

    // Clean up the listener when the component unmounts
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

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
    marginRight: 20,
    flexDirection: "row",
  },
});
