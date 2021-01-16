import React from 'react';
import { Icon, Segment } from 'semantic-ui-react';
import { useStateValue } from '../state';
import { Entry } from '../types';

interface EntryDetailsProps {
	entry: Entry;
}

const assertNever = (value: never): never => {
	throw new Error(`Type missing: ${JSON.stringify(value)}`);
};

const getEntryIcon = (entry: Entry) => {
	switch (entry.type) {
		case 'HealthCheck':
			return <Icon name="stethoscope" size="big" />;
		case 'Hospital':
			return <Icon name="ambulance" size="big" />;
		case 'OccupationalHealthcare':
			return <Icon name="factory" size="big" />;
		default:
			return assertNever(entry);
	}
};

const EntryDetails: React.FC<EntryDetailsProps> = ({ entry }) => {
	const [{ diagnoses }] = useStateValue();
	const icon = getEntryIcon(entry);

	return (
		<Segment>
			<h3>{icon} {entry.date}</h3>
			<p>{entry.description}</p>
			<ul>
				{entry.diagnosisCodes?.map(code => (
					<li key={code}>
						<p>{code} {diagnoses[code]?.name}</p>
					</li>
				))}
			</ul>
		</Segment>
	);
};

export default EntryDetails;
