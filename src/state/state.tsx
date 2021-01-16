import React, { createContext, useContext, useReducer } from "react";
import { Diagnosis, Entry, Patient } from "../types";
import { Action, AddEntryAction, AddPatientAction, SetDiagnosisListAction, SetPatientListAction } from "./reducer";

export type State = {
  patients: { [id: string]: Patient };
  diagnoses: { [id: string]: Diagnosis };
};

const initialState: State = {
  patients: {},
  diagnoses: {},
};

export const StateContext = createContext<[State, React.Dispatch<Action>]>([
  initialState,
  () => initialState
]);

type StateProviderProps = {
  reducer: React.Reducer<State, Action>;
  children: React.ReactElement;
};

export const StateProvider: React.FC<StateProviderProps> = ({
  reducer,
  children
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateValue = () => useContext(StateContext);

export const setPatientList = (patientList: Patient[]): SetPatientListAction => ({ type: "SET_PATIENT_LIST", payload: patientList });
export const addPatient = (patient: Patient): AddPatientAction => ({ type: "ADD_PATIENT", payload: patient });
export const setDiagnosisList = (diagnoses: Diagnosis[]): SetDiagnosisListAction => ({ type: "SET_DIAGNOSIS_LIST", payload: diagnoses });
export const addEntry = (id: Patient['id'], entry: Entry): AddEntryAction => ({ type: "ADD_ENTRY", payload: { id, entry } });