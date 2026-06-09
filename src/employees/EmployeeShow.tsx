import {
  Show,
  TabbedShowLayout,
  Tab,
  TextField,
  EmailField,
  NumberField,
  BooleanField,
  useRecordContext,
  TopToolbar,
  EditButton,
  ListButton,
} from "react-admin";
import { Box, Typography } from "@mui/material";
import { InternsByManager } from "./InternsByManager";
import { DepartmentStats } from "./DepartmentStats";

const EmployeeTitle = () => {
  const record = useRecordContext();
  if (!record) return <span>Afficher un employé</span>;
  return <span>Afficher : {record.firstname} {record.lastname}</span>;
};

const ShowActions = () => (
  <TopToolbar>
    <ListButton />
    <EditButton />
  </TopToolbar>
);

export const EmployeeShow = () => (
  <Show title={<EmployeeTitle />} actions={<ShowActions />}>
    <TabbedShowLayout>
      <Tab label="Informations personnelles">
        <TextField source="id" />
        <TextField source="firstname" label="Prénom" />
        <TextField source="lastname" label="Nom" />
        <EmailField source="email" label="Email" />
      </Tab>
      <Tab label="Informations professionnelles">
        <TextField source="departement" label="Département" />
        <NumberField
          source="salaire"
          label="Salaire"
          options={{ style: "currency", currency: "EUR" }}
        />
        <BooleanField source="actif" label="Actif" />
      </Tab>
      <Tab label="Statistiques">
        <Box sx={{ display: "grid", gap: 2 }}>
          <Typography variant="h6" gutterBottom>
            Statistiques du département
          </Typography>
          <DepartmentStats />
        </Box>
      </Tab>
      <Tab label="Stagiaires encadrés">
        <InternsByManager />
      </Tab>
    </TabbedShowLayout>
  </Show>
);
