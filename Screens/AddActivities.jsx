import { StyleSheet, Text, TextInput, View, Alert } from "react-native";
import Checkbox from "expo-checkbox";
import React, { useState, useEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../context/ThemeContext";
import colors from "../styles/colors";
import PressableButton from "../Components/PressableButton";
import {
  writeToDB,
  deleteFromDB,
  updateToDB,
} from "../firebase/firebaseHelper";

const AddActivities = ({ navigation, route, isEditMode = false }) => {
  const { theme } = useTheme(); // get the theme from the context

  const [activityType, setActivityType] = useState(null);
  const [activityDuration, setActivityDuration] = useState(null);
  const [date, setDate] = useState(null); // initialize the date to null
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false); // for the special status
  const [showCheckbox, setShowCheckbox] = useState(false); // to control the checkbox visibility

  const [items, setItems] = useState([
    { label: "Walking", value: "Walking" },
    { label: "Running", value: "Running" },
    { label: "Swimming", value: "Swimming" },
    { label: "Weights", value: "Weights" },
    { label: "Yoga", value: "Yoga" },
    { label: "Cycling", value: "Cycling" },
    { label: "Hiking", value: "Hiking" },
  ]);

  const dateOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // Prefill data if it's edit mode
  useEffect(() => {
    if (isEditMode && route.params?.item) {
      const { item } = route.params;

      setActivityType(item.type);
      setActivityDuration(item.duration);

      // Convert Firestore timestamp to Date object
      const timestampDate = new Date(item.date);
      setDate(timestampDate);
      setIsSpecial(item.special || false);
      setShowCheckbox(item.special); // Show checkbox if item was previously special
    }
  }, [isEditMode, route.params]);

  // Automatically check special status based on activity type and duration
  useEffect(() => {
    if (
      (activityType === "Running" || activityType === "Weights") &&
      activityDuration > 60
    ) {
      setIsSpecial(true); // Automatically set special to true based on the condition
      setShowCheckbox(true); // Show the checkbox
    } else {
      setIsSpecial(false); // Not special, set it to false
      setShowCheckbox(false); // Hide the checkbox if not special
    }
  }, [activityType, activityDuration]); // Run this effect whenever activityType or activityDuration changes

  // Re-evaluate special status and checkbox visibility based on activity type and duration only when saving
  const checkSpecialStatus = () => {
    if (
      (activityType === "Running" || activityType === "Weights") &&
      activityDuration > 60
    ) {
      setIsSpecial(true); // Set as special
      setShowCheckbox(true); // Show checkbox only if the activity qualifies as special
    } else {
      setIsSpecial(false); // Not special anymore
      setShowCheckbox(false); // Hide checkbox for non-special activities
    }
  };

  // Validate the form and data
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

  // Handle delete (edit mode)
  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteFromDB("activities", route.params.item.id);
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting document: ", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  // Handle save button
  const handleSave = () => {
    if (validateData()) {
      const newActivity = {
        type: activityType,
        duration: activityDuration,
        date: date.getTime(), // Store as timestamp
        special: isSpecial, // Save special status
      };

      if (isEditMode) {
        Alert.alert(
          "Important",
          "Are you sure you want to save these changes?",
          [
            { text: "No" },
            {
              text: "Yes",
              onPress: () => {
                updateToDB("activities", route.params.item.id, newActivity);
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        writeToDB("activities", newActivity);
        console.log("New activity added: ", newActivity);
        navigation.goBack();
      }
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    navigation.goBack();
  };

  // Handle date input to show
  const handleDateInput = () => {
    if (!date) {
      setDate(new Date());
    }
    setShowDatePicker(!showDatePicker); // Toggle date picker visibility
  };

  // Handle date change
  const onChangeDate = (event, selectedDate) => {
    if (event.type === "set") {
      const currentDate = selectedDate || date;
      setDate(currentDate);
    }
    setShowDatePicker(false);
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
        textStyle={{ color: colors.darkText }}
      />

      {/* Duration */}
      <Text style={[styles.label, { color: theme.textColor }]}>
        Duration (min) *
      </Text>
      <TextInput
        keyboardType="numeric"
        value={activityDuration}
        onChangeText={(text) => setActivityDuration(text)}
        style={styles.input}
        blurOnSubmit={true}
        returnKeyType="done" // added done to iOS numeric keyboard
      />

      {/* DatePicker Text */}
      <View style={{ width: "100%" }}>
        <Text style={[styles.label, { color: theme.textColor }]}>Date *</Text>
        <PressableButton onPress={handleDateInput}>
          <View pointerEvents="none">
            <TextInput
              value={
                date
                  ? new Date(date).toLocaleDateString("en-US", dateOptions)
                  : ""
              }
              style={styles.input}
              editable={false} // Disable the keyboard interaction but allow onPress event
            />
          </View>
        </PressableButton>
      </View>

      {/* DatePicker, wrapped in view for center */}
      {showDatePicker && (
        <View style={styles.datePickerContainer}>
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="inline"
            onChange={onChangeDate}
          />
        </View>
      )}

      {/* Show Checkbox only if the activity is special */}
      {showCheckbox && (
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={isSpecial} // This should reflect the current isSpecial status
            onValueChange={(newValue) => {
              setIsSpecial(newValue); // Toggle isSpecial when user interacts with the checkbox
            }}
            style={{ marginRight: 10 }}
          />
          <Text style={[styles.checkbox, { color: theme.textColor }]}>
            This item is marked as special. Select the checkbox if you would
            like to approve or disapprove the special status.
          </Text>
        </View>
      )}

      {/* Save and Cancel Buttons */}
      <View style={styles.buttonContainer}>
        <PressableButton onPress={handleCancel} style={styles.button}>
          <Text style={styles.buttonText}>Cancel</Text>
        </PressableButton>
        <PressableButton onPress={handleSave} style={styles.button}>
          <Text style={styles.buttonText}>Save</Text>
        </PressableButton>
      </View>

      {/* Edit mode: Delete button */}
      {isEditMode && (
        <PressableButton onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete</Text>
        </PressableButton>
      )}
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
    borderWidth: 1,
    borderColor: "black",
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    height: 40,
    color: colors.darkText,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 20,
  },
  button: {
    backgroundColor: colors.primaryBg,
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  datePickerContainer: {
    width: "100%",
    alignItems: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  checkbox: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
