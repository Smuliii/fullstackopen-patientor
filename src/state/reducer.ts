import { Diagnosis, Entry, Patient } from "../types";
import { State } from "./state";

export type SetPatientListAction = {
  type: "SET_PATIENT_LIST";
  payload: Patient[];
};

export type AddPatientAction = {
  type: "ADD_PATIENT";
  payload: Patient;
};

export type SetDiagnosisListAction = {
  type: "SET_DIAGNOSIS_LIST";
  payload: Diagnosis[];
};

export type AddEntryAction = {
  type: "ADD_ENTRY";
  payload: {
    id: Patient['id'];
    entry: Entry;
  };
};

export type Action =
  | SetPatientListAction
  | AddPatientAction
  | SetDiagnosisListAction
  | AddEntryAction;

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PATIENT_LIST":
      return {
        ...state,
        patients: {
          ...action.payload.reduce(
            (memo, patient) => ({ ...memo, [patient.id]: patient }),
            {}
          ),
          ...state.patients
        }
      };
    case "ADD_PATIENT":
      return {
        ...state,
        patients: {
          ...state.patients,
          [action.payload.id]: action.payload
        }
      };
    case "SET_DIAGNOSIS_LIST":
      return {
        ...state,
        diagnoses: {
          ...action.payload.reduce(
            (memo, diagnosis) => ({ ...memo, [diagnosis.code]: diagnosis }),
            {}
          ),
          ...state.diagnoses
        }
      };
    case "ADD_ENTRY":
      const patient = Object.values(state.patients).find(patient => patient.id === action.payload.id);

      if (patient) {
        patient.entries.push(action.payload.entry);
        return {
          ...state,
          patients: {
            ...state.patients,
            [action.payload.id]: patient,
          }
        };
      }

      return state;
    default:
      return state;
    }
};