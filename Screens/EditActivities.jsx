import AddActivities from "./AddActivities";

const EditActivities = ({ navigation, route }) => {
  return (
    <AddActivities
      navigation={navigation}
      route={route}
      isEditMode={true} // set to edit mode
    />
  );
};

export default EditActivities;
