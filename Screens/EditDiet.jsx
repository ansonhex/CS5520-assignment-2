import AddDiet from "./AddDiet";

const EditDiet = ({ navigation, route }) => {
  return (
    <AddDiet
      navigation={navigation}
      route={route}
      isEditMode={true} // set to edit mode
    />
  );
};

export default EditDiet;
