import React from 'react';
import { Modal } from 'semantic-ui-react';
import { EntryFormTypes, NewEntryForm } from '../types';
import AddEntryForm from './AddEntryForm';

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (form: NewEntryForm) => void;
  formType: EntryFormTypes;
  formSubmitError: string | null;
}

const AddPatientModal = ({ modalOpen, onClose, onSubmit, formType, formSubmitError }: Props) => {
  if (!formType) {
    return null;
  }

  const titles = {
    'Hospital': 'Hospital',
    'OccupationalHealthcare': 'Occupational Healthcare',
    'HealthCheck': 'Health Check',
  };

  return (
    <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
      <Modal.Header>Add a new {titles[formType]} entry</Modal.Header>
      <Modal.Content>
        <AddEntryForm onSubmit={onSubmit} formType={formType} formSubmitError={formSubmitError} />
      </Modal.Content>
    </Modal>
	);
};

export default AddPatientModal;
