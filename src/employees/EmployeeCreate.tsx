import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  SelectInput,
  required,
  minValue,
} from "react-admin";

const departementChoices = [
  { id: "Informatique", name: "Informatique" },
  { id: "Marketing", name: "Marketing" },
  { id: "RH", name: "RH" },
  { id: "Finance", name: "Finance" },
];

export const EmployeeCreate = () => (
  <Create redirect="list">
    <SimpleForm defaultValues={{ actif: true }}>
      <TextInput
        source="firstname"
        label="Prénom"
        validate={required("Le prénom est obligatoire")}
      />
      <TextInput
        source="lastname"
        label="Nom"
        validate={required("Le nom est obligatoire")}
      />
      <TextInput
        source="email"
        label="Email"
        type="email"
        validate={required("L'email est obligatoire")}
      />
      <SelectInput
        source="departement"
        label="Département"
        choices={departementChoices}
        validate={required("Le département est obligatoire")}
      />
      <NumberInput
        source="salaire"
        label="Salaire (€)"
        validate={[
          required("Le salaire est obligatoire"),
          minValue(1500, "Le salaire minimum est 1 500 €"),
        ]}
      />
      <BooleanInput source="actif" label="Actif" />
    </SimpleForm>
  </Create>
);
