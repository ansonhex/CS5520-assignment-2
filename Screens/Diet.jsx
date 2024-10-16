import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { DietContext } from '../context/DietContext';
import ItemsList from '../Components/ItemsList';
import { useTheme } from '../context/ThemeContext';

const Diet = ({ navigation }) => {
  const { diets } = useContext(DietContext);
  const { theme } = useTheme();

  // headerRight button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('AddDietScreen')}>
          <Text style={styles.header}>Add</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme]);

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
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
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 20,
  },
});
