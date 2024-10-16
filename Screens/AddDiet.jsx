import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState, useContext } from "react";
import { DietContext } from "../context/DietContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../context/ThemeContext";
import colors from "../styles/colors";
import PressableButton from "../Components/PressableButton";

const AddDiet = ({ navigation }) => {
  const { theme } = useTheme(); // get the theme from the context
  const { addDiet } = useContext(DietContext); // get the addDiet function from the context

  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState("");
  const [date, setDate] = useState(null); // initialize the date to null
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  // handle Save button
  const handleSave = () => {
    if (validateData()) {
      const isSpecial = calories > 800;

      const newDiet = {
        description,
        calories: Number(calories),
        date: date ? date.toLocaleDateString("en-US", dateOptions) : "",
        special: isSpecial,
      };

      addDiet(newDiet);
      navigation.goBack();
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
              value={date ? date.toLocaleDateString("en-US", dateOptions) : ""}
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
});
