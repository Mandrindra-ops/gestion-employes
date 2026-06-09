import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  SelectInput,
  ReferenceInput,
  FormDataConsumer,
  required,
  minValue,
  email,
} from "react-admin";

const departementChoices = [
  { id: "Informatique", name: "Informatique" },
  { id: "Marketing", name: "Marketing" },
  { id: "RH", name: "RH" },
  { id: "Finance", name: "Finance" },
];

const validateSalary = (formData: any) => (value: any) => {
  if (formData?.remunerer && (value === undefined || value === null || value === "")) {
    return "La rémunération est obligatoire si le stage est rémunéré";
  }

  if (value !== undefined && value !== null && value !== "" && value < 0) {
    return "La rémunération doit être positive";
  }

  return undefined;
};

export const InternCreate = () => (
  <Create redirect="list">
    <SimpleForm defaultValues={{ actif: true, remunerer: false }}>
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
        validate={[required("L'email est obligatoire"), email()]}
      />
      <SelectInput
        source="departement"
        label="Département"
        choices={departementChoices}
        validate={required("Le département est obligatoire")}
      />
      <BooleanInput source="remunerer" label="Rémunéré" />
      <FormDataConsumer>
        {({ formData }) => (
          <NumberInput
            source="salaire"
            label="Rémunération (€)"
            validate={[validateSalary(formData), minValue(0, "La rémunération doit être positive")]}
          />
        )}
      </FormDataConsumer>
      <FormDataConsumer>
        {({ formData }) => (
          <ReferenceInput
            source="managerId"
            reference="employees"
            label="Manager"
            filter={{
              actif: true,
              ...(formData?.departement ? { departement: formData.departement } : {}),
            }}
            validate={required("Le manager est obligatoire")}
          >
            <SelectInput optionText={(record: any) => `${record.firstname} ${record.lastname}`} />
          </ReferenceInput>
        )}
      </FormDataConsumer>
      <BooleanInput source="actif" label="Actif" />
    </SimpleForm>
  </Create>
);
