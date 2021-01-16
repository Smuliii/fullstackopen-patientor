import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import AddEntryModal from '../AddEntryModal';
import EntryDetails from '../components/EntryDetails';
import { apiBaseUrl } from '../constants';
import { addEntry, addPatient, useStateValue } from '../state';
import { Entry, EntryFormTypes, NewEntryForm, Patient } from '../types';

export interface PatientPageParams {
	id: string;
}

const PatientPage: React.FC = () => {
	const [{ patients }, dispatch] = useStateValue();
	const { id } = useParams<PatientPageParams>();
	const patient: Patient = patients[id];

	const [modalOpen, setModalOpen] = useState(false);
	const [formSubmitError, setFormSubmitError] = useState(null);
	const [formType, setFormType] = useState<EntryFormTypes>(null);

	const openModal = () => setModalOpen(true);
	const closeModal = () => { setModalOpen(false); setFormSubmitError(null); };

	const handleSubmit = async (form: NewEntryForm) => {
		setFormSubmitError(null);
		try {
			const { data: entry } = await axios.post<Entry>(`${apiBaseUrl}/patients/${id}/entries`, form);
			dispatch(addEntry(id, entry));
			closeModal();
		} catch (e) {
			setFormSubmitError(e.response.data.error);
			console.error(e);
		}
	};

	useEffect(() => {
		const fetchPatient = async () => {
			try {
				const { data: patient } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
				dispatch(addPatient(patient));
			} catch (e) {
				console.error(e);
			}
		};

		if (!patient?.ssn) {
			fetchPatient();
		}
	}, [id, patient, dispatch]);

	if (!patient) {
		return null;
	}

	return (
		<div>
			<h1>{patient.name}</h1>
			<div>
				SSN: {patient.ssn} <br />
				Gender: {patient.gender} <br />
				Date of birth: {patient.dateOfBirth} <br />
				Occupation: {patient.occupation} <br />
			</div>
			<h3>Entries</h3>
			{patient.entries.map(entry => <EntryDetails key={entry.id} entry={entry} />)}
			<AddEntryModal
				modalOpen={modalOpen} onClose={closeModal} onSubmit={handleSubmit}
				formType={formType} formSubmitError={formSubmitError}
			/>
			<Button onClick={() => { setFormType('Hospital'); openModal(); }}>Add New Hospital Entry</Button>
			<Button onClick={() => { setFormType('HealthCheck'); openModal(); }}>Add New Health Check Entry</Button>
			<Button onClick={() => { setFormType('OccupationalHealthcare'); openModal(); }}>Add New Occupational Healthcare Entry</Button>
		</div>
	);
};

export default PatientPage;
