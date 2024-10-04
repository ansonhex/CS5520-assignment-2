import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../styles/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const ItemsList = ({ items, type }) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          {/* Left: Type or Description */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              {type === "activity" ? item.type : item.description}
            </Text>
            {item.special && (
              <FontAwesome
                name="warning"
                size={18}
                color={colors.warningColor}
                style={styles.icon}
              />
            )}
          </View>

          {/* Middle: Date */}
          <Text style={styles.details}>{item.date}</Text>

          {/* Right: durations or Calories */}
          <Text style={styles.details}>
            {type === "activity"
              ? `${item.duration} min`
              : `${item.calories} cal`}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default ItemsList;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  item: {
    backgroundColor: colors.primaryBg,
    borderRadius: 10,
    marginVertical: 5,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  title: {
    color: colors.secondaryBg,
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
  },
  icon: {
    marginLeft: 5,
  },
  details: {
    color: colors.darkText,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "white",
    lineHeight: 40,
    marginLeft: 10,
    flex: 1,
  },
});
