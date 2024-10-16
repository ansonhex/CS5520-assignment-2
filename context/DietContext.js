import React, { createContext, useState } from "react";

export const DietContext = createContext();

export const DietProvider = ({ children }) => {
  const [diets, setDiets] = useState([]);

  const addDiet = (diet) => {
    setDiets([...diets, diet]);
  };

  return (
    <DietContext.Provider value={{ diets, addDiet }}>
      {console.log("DietProvider is working", diets)}
      {children}
    </DietContext.Provider>
  );
};
