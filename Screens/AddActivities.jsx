import { StyleSheet, Text, View } from "react-native";
import React, { useState, useContext } from "react";
import { ActivityContext } from "../context/ActivityContext";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../context/ThemeContext";
import colors from "../styles/colors";

const AddActivities = ({ navigation }) => {
  const { theme } = useTheme(); // get the theme from the context
  const { addActivity } = useContext(ActivityContext); // get the addActivity function from the context
  console.log(addActivity);

  const [activityType, setActivityType] = useState(null);
  const [activityDuration, setActivityDuration] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [items, setItems] = useState([
    { label: "Walking", value: "walking" },
    { label: "Running", value: "running" },
    { label: "Swimming", value: "swimming" },
    { label: "Weights", value: "weights" },
    { label: "Yoga", value: "yoga" },
    { label: "Cycling", value: "Cycling" },
    { label: "Hiking", value: "Hiking" },
  ]);

  // validate the form and data
  const validateData = () => {
    if (!activityType) {
      alert("Please select an activity type");
      return false;
    }
    if (!activityDuration || activityDuration <= 0 || isNaN(activityDuration)) {
      alert("Please select an activity duration");
      return false;
    }
    return true;
  };

  // handle Save button
  const handleSave = () => {
    if (validateData()) {
      const isSpecial =
        (activityType === "running" || activityType === "weights") &&
        activityDuration > 60;

      const newActivity = {
        type: activityType,
        duration: activityDuration,
        date: date.toLocaleDateString(),
        special: isSpecial,
      };

      addActivity(newActivity);
      navigation.goBack();
    }
  };

  // handle Cancel button
  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View>
      <Text style={[styles.label, {color: theme.darkText}]}>Activity *</Text>
      <DropDownPicker
        open={showDropdown}
        value={activityType}
        items={items}
        setOpen={setShowDropdown}
        setValue={setActivityType}
        setItems={setItems}
        style={styles.dropdown}
      />
    </View>
  );
};

export default AddActivities;

const styles = StyleSheet.create({
  dropdown: {
    borderRadius: 10,
    margin: 10,
    borderColor: colors.primaryBg,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
});
