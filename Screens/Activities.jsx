import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'

const Activities = ({ navigation }) => {
  return (
    <View>
      <Text>Activities</Text>
      <Button title="Add Activities" onPress={() => navigation.navigate("AddActivitiesScreen")} />
    </View>
  )
}

export default Activities

const styles = StyleSheet.create({})