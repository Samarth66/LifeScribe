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

const initialSelectedJournalDetails = {
  selectedJournalDetails: {
    id: "",
    title: "",
    description: "",
    date: "",
  },
};

const selectedJournalDetailsReducer = (
  state = initialSelectedJournalDetails,
  action
) => {
  console.log("test ", action.payload);
  switch (action.type) {
    case "GET_JOURNAL_DETAILS":
      return {
        ...state,
        selectedJournalDetails: {
          id: action.payload.id,
          title: action.payload.title,
          description: action.payload.description,
          data: action.payload.date,
        },
      };
    default:
      return state;
  }
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
        journalEntries: [action.payload, ...state.journalEntries],
      };
    case "FETCH_JOURNAL_ENTRIES":
      return {
        ...state,
        journalEntries: action.payload,
      };
    default:
      return state;
  }
};

const store = configureStore({
  reducer: {
    journal: journalReducer,
    userDetails: userReducer,
    journalDetails: selectedJournalDetailsReducer,
  },
});

export default store;
