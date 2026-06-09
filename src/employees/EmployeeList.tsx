import {
  List,
  DataTable,
  EmailField,
  NumberField,
  BooleanField,
  SearchInput,
  SelectInput,
  EditButton,
  DeleteButton,
  ShowButton,
} from "react-admin";
import { QuickStatusToggle } from "./QuickStatusToggle";

const departementChoices = [
  { id: "Informatique", name: "Informatique" },
  { id: "Marketing", name: "Marketing" },
  { id: "RH", name: "RH" },
  { id: "Finance", name: "Finance" },
];

const employeeFilters = [
  <SearchInput source="q" alwaysOn />,
  <SelectInput
    source="departement"
    label="Département"
    choices={departementChoices}
    emptyText="Tous les départements"
  />,
];

export const EmployeeList = () => (
  <List
    filters={employeeFilters}
    perPage={2}
    disableSyncWithLocation
  >
    <DataTable rowClick="show">
      <DataTable.Col source="id" />
      <DataTable.Col source="firstname" label="Prénom" />
      <DataTable.Col source="lastname" label="Nom" />
      <DataTable.Col source="email">
        <EmailField source="email" />
      </DataTable.Col>
      <DataTable.Col source="departement" label="Département" />
      <DataTable.Col source="salaire" label="Salaire">
        <NumberField
          source="salaire"
          options={{
            style: "currency",
            currency: "EUR",
          }}
        />
      </DataTable.Col>
      <DataTable.Col source="actif" label="Actif">
        <BooleanField source="actif" />
      </DataTable.Col>
      <DataTable.Col label="Statut rapide">
        <QuickStatusToggle />
      </DataTable.Col>
      <DataTable.Col label="Actions">
        <ShowButton />
        <EditButton />
        <DeleteButton />
      </DataTable.Col>
    </DataTable>
  </List>
);
