import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  SelectInput,
  ReferenceInput,
  required,
  minValue,
  email,
} from "react-admin";
import { useFormState } from "react-hook-form";

const departementChoices = [
  { id: "Informatique", name: "Informatique" },
  { id: "Marketing", name: "Marketing" },
  { id: "RH", name: "RH" },
  { id: "Finance", name: "Finance" },
];

export const InternCreate = () => {
  const { values } = useFormState();
  const isRemunerate = values?.remunerer === true;
  const managerFilter = {
    actif: true,
    ...(values?.departement ? { departement: values.departement } : {}),
  };

  const validateSalary = (value: any) => {
    if (isRemunerate && (value === undefined || value === null || value === "")) {
      return "La rémunération est obligatoire si le stage est rémunéré";
    }

    if (value !== undefined && value !== null && value !== "" && value < 0) {
      return "La rémunération doit être positive";
    }

    return undefined;
  };

  return (
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
        <NumberInput
          source="salaire"
          label="Rémunération (€)"
          validate={[validateSalary, minValue(0, "La rémunération doit être positive")]}
        />
        <ReferenceInput
          source="managerId"
          reference="employees"
          label="Manager"
          filter={managerFilter}
          validate={required("Le manager est obligatoire")}
        >
          <SelectInput optionText={(record: any) => `${record.firstname} ${record.lastname}`} />
        </ReferenceInput>
        <BooleanInput source="actif" label="Actif" />
      </SimpleForm>
    </Create>
  );
};
