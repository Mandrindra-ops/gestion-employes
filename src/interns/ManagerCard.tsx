import { useRecordContext, useGetOne } from "react-admin";
import {
  Card,
  CardContent,
  Typography,
  Link,
  Box,
  Chip,
  Avatar,
} from "@mui/material";
import { Person as PersonIcon, Email as EmailIcon, LocationCity as LocationCityIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from "@mui/icons-material";

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
    <Card
      sx={{
        background: "linear-gradient(135deg, #667eea20 0%, #764ba220 100%)",
        borderLeft: "4px solid #667eea",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: "#667eea",
              mr: 2,
              width: 48,
              height: 48,
            }}
          >
            <PersonIcon />
          </Avatar>
          <Box flex={1}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              {manager.firstname} {manager.lastname}
            </Typography>
            <Chip
              icon={manager.actif ? <CheckCircleIcon /> : <CancelIcon />}
              label={manager.actif ? "Actif" : "Inactif"}
              size="small"
              color={manager.actif ? "success" : "error"}
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <LocationCityIcon sx={{ mr: 1, color: "#667eea", fontSize: "1.2rem" }} />
          <Typography>
            <strong>Département :</strong> {manager.departement}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <EmailIcon sx={{ mr: 1, color: "#667eea", fontSize: "1.2rem" }} />
          <Link href={`mailto:${manager.email}`} underline="hover" sx={{ fontWeight: 500 }}>
            {manager.email}
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};
