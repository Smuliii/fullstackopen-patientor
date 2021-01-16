import { Field, Form, Formik } from "formik";
import React from 'react';
import { Button } from "semantic-ui-react";
import { DiagnosisSelection, NumberField, TextField } from "../AddPatientModal/FormField";
import { useStateValue } from "../state";
import { EntryFormTypes, HealthCheckEntry, HealthCheckRating, HospitalEntry, NewEntryForm, OccupationalHealthcareEntry } from "../types";

interface Props {
	onSubmit: (form: NewEntryForm) => void;
	formType: EntryFormTypes;
	formSubmitError: string | null;
}

interface Errors {
	[key: string]: string;
}

interface FormSettings {
	form: FormType;
	initialValues: NewEntryForm;
}

type FormType = Exclude<EntryFormTypes, null>;

type RequiredFields =
	| Omit<HealthCheckEntry, 'id' | 'diagnosisCodes'>
	| Omit<HospitalEntry, 'id' | 'diagnosisCodes'>
	| Omit<OccupationalHealthcareEntry, 'id' | 'diagnosisCodes' | 'sickLeave'>;

const assertFormType = (type: never): never => {
	throw new Error(`Missing form type: ${type}`);
};

const formSettings = (formType: FormType): FormSettings => {
	const baseFields = {
		description: '',
		date: '',
		specialist: '',
		diagnosisCodes: [],
	};

	switch (formType) {
		case 'HealthCheck':
			return {
				form: formType,
				initialValues: {
					type: formType,
					...baseFields,
					healthCheckRating: HealthCheckRating.Healthy,
				},
				// requiredFields: ['healthCheckRating'],
			};

		case 'Hospital':
			return {
				form: formType,
				initialValues: {
					type: formType,
					...baseFields,
					discharge: {
						date: '',
						criteria: '',
					},
				},
				// requiredFields: [],
			};

		case 'OccupationalHealthcare':
			return {
				form: formType,
				initialValues: {
					type: formType,
					...baseFields,
					employerName: '',
					sickLeave: {
						startDate: '',
						endDate: '',
					},
				},
				// requiredFields: ['employerName'],
			};

		default:
			return assertFormType(formType);
	}
};

const AddEntryForm: React.FC<Props> = ({ onSubmit, formType, formSubmitError }) => {
	const [{ diagnoses }] = useStateValue();

	if (!formType) {
		return null;
	}

	const { initialValues/* , requiredFields */ } = formSettings(formType);

	const validation = (values: NewEntryForm) => {
		const requiredFields: (keyof RequiredFields)[] = ['type', 'description', 'date', 'specialist'];
		const requiredError = 'Field is required';
		const errors: Errors = {};

		requiredFields.forEach(field => {
			if (values[field] === '') {
				errors[field] = requiredError;
			}
		});

        return errors;
	};

	return (
		<div>
			<Formik initialValues={initialValues} validate={validation} onSubmit={onSubmit}>
				{({ setFieldValue, setFieldTouched }) => (
					<Form className="form ui">
						<Field name="description" label="Description" placeholder="Description" component={TextField} />
						<Field name="date" label="Date" placeholder="YYYY-MM-DD" component={TextField} />
						<Field name="specialist" label="Specialist" placeholder="Specialist" component={TextField} />
						<DiagnosisSelection diagnoses={Object.values(diagnoses)} setFieldValue={setFieldValue} setFieldTouched={setFieldTouched} />
						{formType === 'HealthCheck' && (
							<Field name="healthCheckRating" label="Health check rating" component={NumberField} min={0} max={3} />
						)}
						{formType === 'Hospital' && (
							<div className="field">
								<Field name="discharge.date" label="Discharge - Date" placeholder="YYYY-MM-DD" component={TextField} />
								<Field name="discharge.criteria" label="Discharge - Criteria" placeholder="Criteria" component={TextField} />
							</div>
						)}
						{formType === 'OccupationalHealthcare' && (
							<div className="field">
								<Field name="sickLeave.startDate" label="Sick leave - Start date" placeholder="YYYY-MM-DD" component={TextField} />
								<Field name="sickLeave.endDate" label="Sick leave - End date" placeholder="YYYY-MM-DD" component={TextField} />
							</div>
						)}
						{formSubmitError && (
							<p style={{ color:'red' }}>{formSubmitError}</p>
						)}
						<Button type="submit" color="green">Add</Button>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default AddEntryForm;
