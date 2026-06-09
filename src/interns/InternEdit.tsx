import {
  Edit,
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
  useRecordContext,
} from "react-admin";

const departementChoices = [
  { id: "Informatique", name: "Informatique" },
  { id: "Marketing", name: "Marketing" },
  { id: "RH", name: "RH" },
  { id: "Finance", name: "Finance" },
];

const InternTitle = () => {
  const record = useRecordContext();
  if (!record) return <span>Modifier un stagiaire</span>;
  return (
    <span>
      Modifier : {record.firstname} {record.lastname}
    </span>
  );
};

const validateSalary = (formData: any) => (value: any) => {
  if (formData?.remunerer && (value === undefined || value === null || value === "")) {
    return "La rémunération est obligatoire si le stage est rémunéré";
  }

  if (value !== undefined && value !== null && value !== "" && value < 0) {
    return "La rémunération doit être positive";
  }

  return undefined;
};

export const InternEdit = () => (
  <Edit title={<InternTitle />} redirect="list">
    <SimpleForm>
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
            validate={required()}
          >
            <SelectInput optionText={(record: any) => `${record.firstname} ${record.lastname}`} />
          </ReferenceInput>
        )}
      </FormDataConsumer>
      <BooleanInput source="actif" label="Actif" />
    </SimpleForm>
  </Edit>
);
