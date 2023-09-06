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

const initialBoard = {
  boardEntries: [],
};

const initialSelectedBoardDetails = {
  board: {
    boardId: "",
    title: "",
  },
};

const initialSelectedDateDetails = {
  selectedDateDetails: {
    date: new Date().toISOString().split("T")[0],
  },
};

const initialSelectedHealthId = {
  selectedIdDetails: {
    id: "",
  },
};

const selectedBoardDetailsReducer = (
  state = initialSelectedBoardDetails,
  action
) => {
  switch (action.type) {
    case "SELECTED_JOURNAL_DETAIL":
      return {
        ...state,
        board: {
          boardId: action.payload._id,
          title: action.payload.title,
        },
      };
    default:
      return state;
  }
};

const selectedDateDetailsReducer = (
  state = initialSelectedDateDetails,
  action
) => {
  switch (action.type) {
    case "SELECTED_DATE_DETAIL":
      return {
        ...state,
        selectedDateDetails: {
          date: action.payload,
        },
      };
    default:
      return state;
  }
};

const selectedHealthIdReducer = (state = initialSelectedHealthId, action) => {
  switch (action.type) {
    case "SELECTED_HEALTH_ID":
      return {
        ...state,
        selectedIdDetails: {
          id: action.payload,
        },
      };
    default:
      return state;
  }
};

const selectedJournalDetailsReducer = (
  state = initialSelectedJournalDetails,
  action
) => {
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

const boardReducer = (state = initialBoard, action) => {
  switch (action.type) {
    case "FETCH_BOAD_ENTRIES":
      console.log("Fetching board entries:", action.payload);
      return {
        ...state,
        boardEntries: action.payload,
      };
    case "ADD_BOARD_ENTRIES":
      return {
        ...state,
        boardEntries: [...state.boardEntries, action.payload],
      };
    default:
      return state;
  }
};

const store = configureStore({
  reducer: {
    journal: journalReducer,
    board: boardReducer,
    userDetails: userReducer,
    journalDetails: selectedJournalDetailsReducer,
    boardDetails: selectedBoardDetailsReducer,
    selectedDateDetails: selectedDateDetailsReducer,
    selectedIdDetails: selectedHealthIdReducer,
  },
});

export default store;
