import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
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

  // handle date input to show
  const handleDateInput = () => {
    setShowDatePicker(true);
  };

  // handle date change
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      {/* Activity Dropdown */}
      <Text style={[styles.label, { color: theme.textColor }]}>Activity *</Text>
      <DropDownPicker
        open={showDropdown}
        value={activityType}
        items={items}
        setOpen={setShowDropdown}
        setValue={setActivityType}
        setItems={setItems}
        style={styles.dropdown}
      />

      {/* Duration */}
      <Text style={[styles.label, { color: theme.textColor }]}>
        Duration (min) *
      </Text>
      <TextInput
        keyboardType="numeric"
        value={activityDuration}
        onChangeText={(text) => setActivityDuration(text)}
        style={[styles.input, { color: theme.textColor }]}
      />

      {/* DatePicker Text */}
      <Text style={[styles.label, { color: theme.textColor }]}>Date *</Text>
      <TextInput
        value={date.toLocaleDateString()}
        onPressIn={handleDateInput}
        style={[
          styles.input,
          { color: theme.textColor },
        ]}
        placeholder="Select Date"
        placeholderTextColor={colors.primaryBg}
      />
      {/* DatePicker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="calendar"
          onChange={onChangeDate}
        />
      )}

      {/* Save and Cancel Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddActivities;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "flex-start",
  },
  dropdown: {
    borderRadius: 5,
    marginBottom: 10,
    borderColor: colors.primaryBg,
    width: "100%",
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    fontWeight: "bold",
    paddingVertical: 5,
  },
  input: {
    width: "100%",
    boardWidth: 3,
    boarderColor: "black",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    height: 40,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 20,
  },
  cancelButton: {
    color: "blue",
    fontSize: 18,
    fontWeight: "600",
  },
  saveButton: {
    color: "blue",
    fontSize: 18,
    fontWeight: "600",
  },
});
