import { useRecordContext, useGetOne } from "react-admin";
import { Card, CardContent, Typography, Link } from "@mui/material";

export const ManagerCard = () => {
  const intern = useRecordContext();
  const managerId = intern?.managerId;

  const {
    data: manager,
    error,
    isPending,
  } = useGetOne(
    "employees",
    { id: managerId },
    {
      enabled: !!managerId,
    }
  );

  if (!managerId) {
    return <Typography>Aucun manager défini pour ce stagiaire.</Typography>;
  }

  if (isPending) {
    return <Typography>Chargement du manager...</Typography>;
  }

  if (error) {
    return <Typography color="error">Erreur de chargement du manager.</Typography>;
  }

  if (!manager) {
    return <Typography>Manager non trouvé.</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {manager.firstname} {manager.lastname}
        </Typography>
        <Typography>Département : {manager.departement}</Typography>
        <Typography>
          Email :{' '}
          <Link href={`mailto:${manager.email}`} underline="hover">
            {manager.email}
          </Link>
        </Typography>
        <Typography>Statut : {manager.actif ? "Actif" : "Inactif"}</Typography>
      </CardContent>
    </Card>
  );
};
