import React, { createContext, useState } from "react";

export const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);

  const addActivity = (activity) => {
    setActivities([...activities, activity]);
  };

  return (
    <ActivityContext.Provider value={{ activities, addActivity }}>
      {console.log("ActivityProvider is working", activities)}
      {children}
    </ActivityContext.Provider>
  );
};
