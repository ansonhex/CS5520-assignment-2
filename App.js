import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View } from "react-native";
import Settings from "./Screens/Settings";
import Activities from "./Screens/Activities";
import AddActivities from "./Screens/AddActivities";
import Diet from "./Screens/Diet";
import AddDiet from "./Screens/AddDiet";


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ActivitiesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ActivitiesHome" component={Activities} />
      <Stack.Screen name="AddActivitiesScreen" component={AddActivities} />
    </Stack.Navigator>
  );
}

function DietStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DietHome" component={Diet} />
      <Stack.Screen name="AddDietScreen" component={AddDiet} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="ActivitiesTab" component={ActivitiesStack} />
        <Tab.Screen name="DietTab" component={DietStack} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
