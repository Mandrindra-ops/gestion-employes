import { useRecordContext, useGetList } from "react-admin";
import { Box, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export const InternsByManager = () => {
  const record = useRecordContext();
  const managerId = record?.id;

  const { data, total, error, isPending } = useGetList(
    "interns",
    {
      pagination: { page: 1, perPage: 100 },
      sort: { field: "id", order: "ASC" },
      filter: { managerId },
    },
    { enabled: !!managerId }
  );

  if (!managerId) {
    return <Typography>Pas d'employé sélectionné.</Typography>;
  }

  if (isPending) {
    return <Typography>Chargement des stagiaires encadrés...</Typography>;
  }

  if (error) {
    return <Typography color="error">Erreur lors du chargement des stagiaires.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Stagiaires encadrés ({total ?? 0})
      </Typography>
      {total === 0 && (
        <Typography>Aucun stagiaire n'est actuellement encadré par cet employé.</Typography>
      )}
      {data?.map((intern: any) => (
        <Box key={intern.id} sx={{ mb: 1, p: 1, border: "1px solid #ddd", borderRadius: 1 }}>
          <Typography>
            <Link component={RouterLink} to={`/interns/${intern.id}/show`} underline="hover">
              {intern.firstname} {intern.lastname}
            </Link>
          </Typography>
          <Typography variant="body2">Département : {intern.departement}</Typography>
          <Typography variant="body2">Email : {intern.email}</Typography>
          <Typography variant="body2">Rémunéré : {intern.remunerer ? "Oui" : "Non"}</Typography>
        </Box>
      ))}
    </Box>
  );
};
