import { useRecordContext, useGetList } from "react-admin";
import { Typography } from "@mui/material";

export const DepartmentStats = () => {
  const record = useRecordContext();
  const department = record?.departement;

  const { total, error, isPending } = useGetList(
    "employees",
    {
      pagination: { page: 1, perPage: 1 },
      sort: { field: "id", order: "ASC" },
      filter: { departement: department, actif: true },
    },
    { enabled: !!department }
  );

  if (!department) {
    return <Typography>Département non défini.</Typography>;
  }

  if (isPending) {
    return <Typography>Chargement des statistiques...</Typography>;
  }

  if (error) {
    return <Typography color="error">Erreur lors du chargement des statistiques.</Typography>;
  }

  return (
    <Typography>
      Nombre de collègues actifs dans le département {department} : {total ?? 0}
    </Typography>
  );
};
