import {
  Show,
  SimpleShowLayout,
  TextField,
  EmailField,
  NumberField,
  BooleanField,
} from "react-admin";
import { Box, Typography } from "@mui/material";
import { ManagerCard } from "./ManagerCard";

export const InternShow = () => (
  <Show>
    <SimpleShowLayout>
      <Box sx={{ display: "grid", gap: 2 }}>
        <Box>
          <Typography variant="h6" component="h2" gutterBottom>
            Informations du stagiaire
          </Typography>
          <TextField source="firstname" label="Prénom" />
          <TextField source="lastname" label="Nom" />
          <EmailField source="email" label="Email" />
          <TextField source="departement" label="Département" />
          <NumberField
            source="salaire"
            label="Rémunération"
            options={{ style: "currency", currency: "EUR" }}
          />
          <BooleanField source="remunerer" label="Rémunéré" />
          <BooleanField source="actif" label="Actif" />
        </Box>

        <Box>
          <Typography variant="h6" component="h2" gutterBottom>
            Manager
          </Typography>
          <ManagerCard />
        </Box>
      </Box>
    </SimpleShowLayout>
  </Show>
);
