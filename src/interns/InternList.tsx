import { List, ReferenceField, NumberField, EditButton, DeleteButton, DataTable, EmailField, BooleanField, FunctionField, SearchInput, SelectInput, TopToolbar } from 'react-admin';
import { QuickInternCreateButton } from './QuickInternCreateButton';

const InternListActions = () => (
  <TopToolbar>
    <QuickInternCreateButton />
  </TopToolbar>
);

export const InternList = () => {
  const departementChoices = [
    { id: "Informatique", name: "Informatique" },
    { id: "Marketing", name: "Marketing" },
    { id: "RH", name: "RH" },
    { id: "Finance", name: "Finance" },
  ];
  const remunereChoices = [
  { id: true, name: "Rémunéré" },
  { id: false, name: "Non rémunéré" },
];
  const internFilters = [
    <SearchInput source="q" alwaysOn />,
    <SelectInput
      source="departement"
      label="Département"
      choices={departementChoices}
      emptyText="Tous les départements"
    />,
    <SelectInput
      source="remunerer"
      label="Rémunéré"
      choices={remunereChoices}
      emptyText="Tous les statuts"
    />,
  ];  

  return (
    <List filters={internFilters} actions={<InternListActions />}>
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
             <DataTable.Col source="remunerer" label="remunerer">
              <BooleanField source="remunerer" />
            </DataTable.Col>

            <DataTable.Col source="managerId" label="Manager">
              <ReferenceField source="managerId" reference="employees" link="show">
                <FunctionField render={(record: { firstname: string; lastname: string }) => `${record.firstname} ${record.lastname}`} />
              </ReferenceField>
            </DataTable.Col>
            <DataTable.Col label="Actions">
              
              <EditButton />
              <DeleteButton />
            </DataTable.Col>
          </DataTable>
    </List>
  );
};