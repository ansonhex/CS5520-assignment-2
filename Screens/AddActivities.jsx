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
import FontAwesome from "@expo/vector-icons/FontAwesome";

const AddActivities = ({ navigation, route, isEditMode = false }) => {
  const { theme } = useTheme(); // get the theme from the context

  const [activityType, setActivityType] = useState(null);
  const [activityDuration, setActivityDuration] = useState(null);
  const [date, setDate] = useState(null); // initialize the date to null
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false); // for the special status
  const [showCheckbox, setShowCheckbox] = useState(false); // to control the checkbox visibility
  const [isSpecialManuallyChanged, setIsSpecialManuallyChanged] =
    useState(false); // to track if the checkbox is manually changed

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

  // set delete button to header right in edit mode
  useEffect(() => {
    if (isEditMode) {
      navigation.setOptions({
        headerRight: () => (
          <PressableButton onPress={handleDelete}>
            <FontAwesome
              name="trash"
              size={20}
              color="white"
              style={{ paddingRight: 20 }}
            />
          </PressableButton>
        ),
      });
    }
  }, [navigation, isEditMode]);

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
      let specialStatus = isSpecial;

      // Only update special status if it's not manually changed
      if (!isSpecialManuallyChanged) {
        if (
          (activityType === "Running" || activityType === "Weights") &&
          activityDuration > 60
        ) {
          specialStatus = true;
        } else {
          specialStatus = false;
        }
      }

      const newActivity = {
        type: activityType,
        duration: activityDuration,
        date: date.getTime(), // Store as timestamp
        special: specialStatus, // Save special status
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
                console.log("Updated item: ", newActivity);
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        writeToDB("activities", newActivity);
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

  // handle checkbox change
  const handleSpecialCheckboxChange = (newValue) => {
    const updatedSpecialStatus = !newValue;
    setIsSpecial(updatedSpecialStatus);
    setIsSpecialManuallyChanged(true); // Set the flag to true

    // defensive coding, push the updated special status to the state
    if (isEditMode) {
      const updatedActivity = {
        type: activityType,
        duration: activityDuration,
        date: date.getTime(),
        special: updatedSpecialStatus,
      };

      updateToDB("activities", route.params.item.id, updatedActivity);
    }
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
          <Text style={[styles.checkbox, { color: theme.textColor }]}>
            This item is marked as special. Select the checkbox if you would
            like to disapprove the special status.
          </Text>
          <Checkbox
            value={!isSpecial} // default value is false
            onValueChange={handleSpecialCheckboxChange}
            style={{ marginHorizontal: 10 }}
          />
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
    paddingHorizontal: 10,
  },
  checkbox: {
    fontSize: 14,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
});
