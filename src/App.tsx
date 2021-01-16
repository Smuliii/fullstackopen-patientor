import axios from "axios";
import React, { useEffect } from "react";
import { Link, Route, Switch } from "react-router-dom";
import { Button, Container, Divider, Header } from "semantic-ui-react";
import { apiBaseUrl } from "./constants";
import PatientListPage from "./PatientListPage";
import PatientPage from "./PatientPage";
import { setDiagnosisList, setPatientList, useStateValue } from "./state";
import { Diagnosis, Patient } from "./types";

const App: React.FC = () => {
  const [, dispatch] = useStateValue();

  useEffect(() => {
    // axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      try {
        const { data: patients } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);
        dispatch(setPatientList(patients));
      } catch (e) {
        console.error(e);
      }
    };
    fetchPatientList();

    const fetchDiagnoses = async () => {
      try {
        const { data: diagnoses } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
        dispatch(setDiagnosisList(diagnoses));
      } catch (e) {
        console.error(e);
      }
    };
    fetchDiagnoses();
  }, [dispatch]);

  return (
    <div className="App">
      <Container>
        <Header as="h1">Patientor</Header>
        <Button as={Link} to="/" primary>
          Home
        </Button>
        <Divider hidden />
        <Switch>
          <Route path="/patients/:id" render={() => <PatientPage />} />
          <Route path="/" render={() => <PatientListPage />} />
        </Switch>
      </Container>
    </div>
  );
};

export default App;
