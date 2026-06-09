import { useState } from "react";
import { useCreate, useGetList, useNotify, useRefresh } from "react-admin";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";

export const QuickInternCreateButton = () => {
  const [open, setOpen] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [managerId, setManagerId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const notify = useNotify();
  const refresh = useRefresh();
  const [create, { isPending }] = useCreate();
  const { data: managers, isPending: loadingManagers } = useGetList(
    "employees",
    {
      pagination: { page: 1, perPage: 100 },
      sort: { field: "firstname", order: "ASC" },
      filter: { actif: true },
    },
    { enabled: true }
  );

  const handleOpen = () => {
    setErrorMessage("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFirstname("");
    setLastname("");
    setManagerId("");
    setErrorMessage("");
  };

  const handleSubmit = () => {
    if (!firstname.trim() || !lastname.trim() || !managerId) {
      setErrorMessage("Prénom, nom et manager sont requis.");
      return;
    }

    create(
      "interns",
      {
        data: {
          firstname: firstname.trim(),
          lastname: lastname.trim(),
          managerId: Number(managerId),
          actif: true,
          remunerer: false,
        },
      },
      {
        onSuccess: () => {
          notify("Stagiaire créé", { type: "success" });
          refresh();
          handleClose();
        },
        onError: (error) => {
          const message = error?.message || "Erreur lors de la création.";
          setErrorMessage(String(message));
        },
      }
    );
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Ajouter stagiaire rapide
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Ajouter un stagiaire rapide</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
            <TextField
              label="Prénom"
              value={firstname}
              onChange={(event) => setFirstname(event.target.value)}
              fullWidth
            />
            <TextField
              label="Nom"
              value={lastname}
              onChange={(event) => setLastname(event.target.value)}
              fullWidth
            />
            <TextField
              select
              label="Manager"
              value={managerId}
              onChange={(event) => setManagerId(event.target.value)}
              fullWidth
              disabled={loadingManagers}
            >
              <MenuItem value="">Sélectionner un manager</MenuItem>
              {managers?.map((manager: any) => (
                <MenuItem key={manager.id} value={String(manager.id)}>
                  {manager.firstname} {manager.lastname} ({manager.departement})
                </MenuItem>
              ))}
            </TextField>
            {errorMessage && (
              <Typography color="error">{errorMessage}</Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isPending}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={isPending}>
            {isPending ? "Création..." : "Créer"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
