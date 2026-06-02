import { List, Datagrid, TextField, ReferenceField, NumberField, EditButton, DeleteButton, TextInput, BooleanInput, DataTable, EmailField, BooleanField, FunctionField } from 'react-admin';

export const InternList = () => {
  const internFilters = [
    <TextInput source="department" label="Département" alwaysOn />,
    <BooleanInput source="isRemunerate" label="Rémunéré" />,
  ];

  return (
    <List filters={internFilters}>
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