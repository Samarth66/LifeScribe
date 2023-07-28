import { configureStore } from "@reduxjs/toolkit";

const initialState = {
  journalEntries: [],
};

const initialUserDetails = {
  userDetails: {
    id: "",
    name: "",
  },
};

const userReducer = (state = initialUserDetails, action) => {
  switch (action.type) {
    case "SET_USER_DETAILS":
      return {
        ...state,
        userDetails: {
          id: action.payload.id,
          name: action.payload.name,
        },
      };
    default:
      return state;
  }
};

const journalReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_ENTRY":
      return {
        ...state,
        journalEntries: [...state.journalEntries, action.payload],
      };
    default:
      return state;
  }
};

const store = configureStore({
  reducer: {
    journal: journalReducer,
    userDetails: userReducer,
  },
});

export default store;
