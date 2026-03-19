/**
 * Application store using React Context
 */

import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { Assessment, Answer, ComputedResult } from "../domain/types";
import { updateAssessmentWithResults } from "../domain/computeProfile";
import {
  saveAssessment,
  setLastAssessmentId,
} from "../utils/localStorageRepo";

export interface AppState {
  currentAssessment: Assessment | null;
  isLoading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: "LOAD_ASSESSMENT"; payload: Assessment }
  | { type: "CREATE_ASSESSMENT"; payload: Assessment }
  | { type: "UPDATE_ANSWER"; payload: { questionId: string; value: any } }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_ASSESSMENT" };

const initialState: AppState = {
  currentAssessment: null,
  isLoading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "LOAD_ASSESSMENT":
      return {
        ...state,
        currentAssessment: action.payload,
        isLoading: false,
        error: null,
      };

    case "CREATE_ASSESSMENT":
      return {
        ...state,
        currentAssessment: action.payload,
        isLoading: false,
        error: null,
      };

    case "UPDATE_ANSWER": {
      if (!state.currentAssessment) {
        return state;
      }

      const updated: Assessment = {
        ...state.currentAssessment,
        answers: {
          ...state.currentAssessment.answers,
          [action.payload.questionId]: {
            questionId: action.payload.questionId,
            value: action.payload.value,
            timestamp: new Date().toISOString(),
          },
        },
      };

      // Recompute results
      const withResults = updateAssessmentWithResults(updated);

      return {
        ...state,
        currentAssessment: withResults,
        error: null,
      };
    }

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "CLEAR_ASSESSMENT":
      return {
        ...state,
        currentAssessment: null,
        error: null,
      };

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  loadAssessment: (assessment: Assessment) => void;
  createAssessment: (assessment: Assessment) => void;
  updateAnswer: (questionId: string, value: any) => void;
  getCurrentAssessment: () => Assessment | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export interface AppProviderProps {
  children: ReactNode;
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Auto-save with debounce
  useEffect(() => {
    if (state.currentAssessment) {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      saveTimeout = setTimeout(() => {
        saveAssessment(state.currentAssessment!);
        setLastAssessmentId(state.currentAssessment!.id);
      }, 500);
    }

    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [state.currentAssessment]);

  const loadAssessment = useCallback((assessment: Assessment) => {
    dispatch({ type: "LOAD_ASSESSMENT", payload: assessment });
  }, []);

  const createAssessment = useCallback((assessment: Assessment) => {
    dispatch({ type: "CREATE_ASSESSMENT", payload: assessment });
  }, []);

  const updateAnswer = useCallback((questionId: string, value: any) => {
    dispatch({
      type: "UPDATE_ANSWER",
      payload: { questionId, value },
    });
  }, []);

  const getCurrentAssessment = useCallback(() => {
    return state.currentAssessment;
  }, [state.currentAssessment]);

  const value: AppContextType = {
    state,
    dispatch,
    loadAssessment,
    createAssessment,
    updateAnswer,
    getCurrentAssessment,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextType {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
