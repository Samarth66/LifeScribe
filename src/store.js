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

const initialSelectedSpendingDateDetails = {
  selectedSpendingDateDetails: {
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
    case "SELECTED_BOARD_DETAIL":
      return {
        ...state,
        board: {
          boardId: action.payload._id,
          title: action.payload.title,
        },
      };
    case "RESET_SELECTED_BOARD_DETAILS":
      return {
        ...state,
        board: {},
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

const selectedSpendingDateDetailsReducer = (
  state = initialSelectedSpendingDateDetails,
  action
) => {
  switch (action.type) {
    case "SELECTED_SPENDING_DATE_DETAIL":
      return {
        ...state,
        selectedSpendingDateDetails: {
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
          date: action.payload.date, // typo fix, it was 'data'
        },
      };
    case "RESET_SELECTED_JOURNAL_DETAILS":
      return {
        ...state,
        selectedJournalDetails: {}, // Or whatever your initial state should be
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
    case "DELETE_JOURNAL_ENTRY":
      const updatedJournalEntries = state.journalEntries.filter(
        (entry) => entry._id !== action.payload
      );
      return {
        ...state,
        journalEntries: updatedJournalEntries,
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
    case "DELETE_BOARD_ENTRY":
      console.log(state.boardEntries);
      const updatedBoards = state.boardEntries.filter(
        (entry) => entry._id !== action.payload
      );
      return {
        ...state,
        boardEntries: updatedBoards,
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
    selectedSpendingDateDetails: selectedSpendingDateDetailsReducer,
    selectedIdDetails: selectedHealthIdReducer,
  },
});

export default store;
