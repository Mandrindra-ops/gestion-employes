import { useGetList } from "react-admin";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";

interface StatCardProps {
  title: string;
  value: number;
  isPending: boolean;
  error?: Error;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({
  title,
  value,
  isPending,
  error,
  icon,
  color,
}: StatCardProps) => (
  <Card
    sx={{
      background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
      borderLeft: `4px solid ${color}`,
      height: "100%",
    }}
  >
    <CardContent>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Box
          sx={{
            color: color,
            fontSize: "2.5rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          {icon}
        </Box>
      </Box>
      <Typography color="textSecondary" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {isPending && <Typography>Chargement...</Typography>}
      {error && <Typography color="error">Erreur</Typography>}
      {!isPending && !error && (
        <Typography
          variant="h4"
          component="div"
          sx={{
            color: color,
            fontWeight: 700,
            fontSize: "2.5rem",
          }}
        >
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
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          mb: 4,
          fontWeight: 700,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        📊 Tableau de bord
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total employés"
            value={totalEmployees ?? 0}
            isPending={loadingTotalEmployees}
            error={errorTotalEmployees}
            icon={<PeopleIcon sx={{ fontSize: "2.5rem" }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Employés actifs"
            value={activeEmployees ?? 0}
            isPending={loadingActiveEmployees}
            error={errorActiveEmployees}
            icon={<CheckCircleIcon sx={{ fontSize: "2.5rem" }} />}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total stagiaires"
            value={totalInterns ?? 0}
            isPending={loadingTotalInterns}
            error={errorTotalInterns}
            icon={<SchoolIcon sx={{ fontSize: "2.5rem" }} />}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Stagiaires rémunérés"
            value={paidInterns ?? 0}
            isPending={loadingPaidInterns}
            error={errorPaidInterns}
            icon={<AttachMoneyIcon sx={{ fontSize: "2.5rem" }} />}
            color="#dc004e"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
