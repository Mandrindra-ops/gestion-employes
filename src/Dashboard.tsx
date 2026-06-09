import { useGetList } from "react-admin";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";

interface StatCardProps {
  title: string;
  value: number;
  isPending: boolean;
  error?: Error;
}

const StatCard = ({ title, value, isPending, error }: StatCardProps) => (
  <Card>
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        {title}
      </Typography>
      {isPending && <Typography>Chargement...</Typography>}
      {error && <Typography color="error">Erreur</Typography>}
      {!isPending && !error && (
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export const Dashboard = () => {
  // Total employés
  const {
    total: totalEmployees,
    isPending: loadingTotalEmployees,
    error: errorTotalEmployees,
  } = useGetList("employees", {
    pagination: { page: 1, perPage: 1 },
    sort: { field: "id", order: "ASC" },
  });

  // Employés actifs
  const {
    total: activeEmployees,
    isPending: loadingActiveEmployees,
    error: errorActiveEmployees,
  } = useGetList("employees", {
    pagination: { page: 1, perPage: 1 },
    sort: { field: "id", order: "ASC" },
    filter: { actif: true },
  });

  // Total stagiaires
  const {
    total: totalInterns,
    isPending: loadingTotalInterns,
    error: errorTotalInterns,
  } = useGetList("interns", {
    pagination: { page: 1, perPage: 1 },
    sort: { field: "id", order: "ASC" },
  });

  // Stagiaires rémunérés
  const {
    total: paidInterns,
    isPending: loadingPaidInterns,
    error: errorPaidInterns,
  } = useGetList("interns", {
    pagination: { page: 1, perPage: 1 },
    sort: { field: "id", order: "ASC" },
    filter: { remunerer: true },
  });

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tableau de bord
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total employés"
            value={totalEmployees ?? 0}
            isPending={loadingTotalEmployees}
            error={errorTotalEmployees}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Employés actifs"
            value={activeEmployees ?? 0}
            isPending={loadingActiveEmployees}
            error={errorActiveEmployees}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total stagiaires"
            value={totalInterns ?? 0}
            isPending={loadingTotalInterns}
            error={errorTotalInterns}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Stagiaires rémunérés"
            value={paidInterns ?? 0}
            isPending={loadingPaidInterns}
            error={errorPaidInterns}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
