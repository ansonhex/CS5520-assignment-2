import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View } from "react-native";
import Settings from "./Screens/Settings";
import Activities from "./Screens/Activities";
import AddActivities from "./Screens/AddActivities";
import Diet from "./Screens/Diet";
import AddDiet from "./Screens/AddDiet";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";
import colors from "./styles/colors";
import ThemeProvider, { useTheme } from "./context/ThemeContext";
import EditActivities from "./Screens/EditActivities";
import EditDiet from "./Screens/EditDiet";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: colors.primaryBg,
  },
  headerTintColor: "white",
};

function ActivitiesStack() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="ActivitiesHome"
        component={Activities}
        options={{
          title: "Activities",
        }}
      />
      <Stack.Screen
        name="AddActivitiesScreen"
        component={AddActivities}
        options={{
          title: "Add An Activity",
        }}
      />
      <Stack.Screen
        name="EditActivityScreen"
        component={EditActivities}
        options={{
          title: "Edit An Activity",
        }}
      />
    </Stack.Navigator>
  );
}

function DietStack() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name="DietHome"
        component={Diet}
        options={{
          title: "Diet",
        }}
      />
      <Stack.Screen
        name="AddDietScreen"
        component={AddDiet}
        options={{
          title: "Add A Diet Entry",
        }}
      />
      <Stack.Screen
        name="EditDietScreen"
        component={EditDiet}
        options={{
          title: "Edit A Diet Entry",
        }}
      />
    </Stack.Navigator>
  );
}

function MainApp() {
  const { theme } = useTheme();
  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              if (route.name === "Activities") {
                return (
                  <FontAwesome5 name="running" size={size} color={color} />
                );
              } else if (route.name === "Diet") {
                return (
                  <MaterialIcons name="fastfood" size={size} color={color} />
                );
              } else if (route.name === "Settings") {
                return <Ionicons name="settings" size={size} color={color} />;
              }
            },
            tabBarActiveTintColor: "orange",
            tabBarInactiveTintColor: "gray",
            tabBarLabelStyle: {
              fontSize: 12,
            },
            tabBarStyle: {
              backgroundColor: colors.primaryBg,
            },
            tabBarLabelPosition: "below-icon",
            headerShown: false,
          })}
        >
          <Tab.Screen name="Activities" component={ActivitiesStack} />
          <Tab.Screen name="Diet" component={DietStack} />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{
              ...defaultScreenOptions,
              headerShown: true,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  // wrapped the MainApp with the all the context providers
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
