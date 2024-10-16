import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import ItemsList from "../Components/ItemsList";
import { useTheme } from "../context/ThemeContext";
import PressableButton from "../Components/PressableButton";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const Diet = ({ navigation }) => {
  const [diets, setDiets] = useState([]);
  const { theme } = useTheme();

  // headerRight button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <PressableButton onPress={() => navigation.navigate("AddDietScreen")}>
          <Text style={styles.header}>Add</Text>
        </PressableButton>
      ),
    });
  }, [navigation, theme]);

  // read data from Firestore with snapshot -> Diet
  useEffect(() => {
    let unsubscribe;

    try {
      unsubscribe = onSnapshot(collection(db, "diets"), (snapshot) => {
        const dietsData = [];
        snapshot.forEach((doc) => {
          dietsData.push({ id: doc.id, ...doc.data() });
        });
        setDiets(dietsData);
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
      <ItemsList items={diets} type="diet" />
    </View>
  );
};

export default Diet;

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
