import { StyleSheet, Text, TextInput, View, Alert } from "react-native";
import React, { useState, useEffect } from "react";
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
import Checkbox from "expo-checkbox";

const AddDiet = ({ navigation, route, isEditMode = false }) => {
  const { theme } = useTheme(); // get the theme from the context

  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [date, setDate] = useState(null); // initialize the date to null
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [isSpecialManuallyChanged, setIsSpecialManuallyChanged] =
    useState(false);

  const dateOptions = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // validate the form and data
  const validateData = () => {
    if (!description) {
      alert("Please provide a description");
      return false;
    }
    if (!calories || calories <= 0 || isNaN(calories)) {
      alert("Please provide valid calories");
      return false;
    }
    return true;
  };

  // prefill the data if in edit mode
  useEffect(() => {
    if (isEditMode && route.params?.item) {
      const { item } = route.params;
      setDescription(item.description);
      setCalories(item.calories.toString());
      setDate(new Date(item.date));
      setIsSpecial(item.special || false);
      setShowCheckbox(item.special);
    }
  }, [isEditMode, route.params]);

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
              await deleteFromDB("diets", route.params.item.id);
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

  // handle Save button
  const handleSave = () => {
    if (validateData()) {
      let specialStatus = isSpecial;
      if (!isSpecialManuallyChanged) {
        if (calories > 800) {
          specialStatus = true;
        } else {
          specialStatus = false;
        }
      }

      const newDiet = {
        description,
        calories: Number(calories),
        date: date.getTime(),
        special: specialStatus,
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
                updateToDB("diets", route.params.item.id, newDiet);
                console.log("Updated item: ", newDiet);
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        writeToDB("diets", newDiet);
        navigation.goBack();
      }
    }
  };

  // handle Cancel button
  const handleCancel = () => {
    navigation.goBack();
  };

  // handle date input to show
  const handleDateInput = () => {
    if (!date) {
      setDate(new Date());
    }
    setShowDatePicker(!showDatePicker); // tap text input to toggle date picker
  };

  // handle date change
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
    setIsSpecialManuallyChanged(true);

    if (isEditMode) {
      const updatedActivity = {
        ...route.params.item,
        special: updatedSpecialStatus,
      };

      updateToDB("diets", route.params.item.id, updatedActivity);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      {/* Description */}
      <Text style={[styles.label, { color: theme.textColor }]}>
        Description *
      </Text>
      <TextInput
        value={description}
        onChangeText={(text) => setDescription(text)}
        style={styles.input}
        blurOnSubmit={true}
      />

      {/* Calories */}
      <Text style={[styles.label, { color: theme.textColor }]}>Calories *</Text>
      <TextInput
        keyboardType="numeric"
        value={calories}
        onChangeText={(text) => setCalories(text)}
        style={styles.input}
        blurOnSubmit={true}
        returnKeyType="done" // added done to iOS numeric keyboard
      />

      {/* DatePicker Text */}
      <View style={{ width: "100%" }}>
        <Text style={[styles.label, { color: theme.textColor }]}>Date *</Text>
        <PressableButton onPress={handleDateInput} style={{ width: "100%" }}>
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
            like to approve it.
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

export default AddDiet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "flex-start",
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
