import type { MouseEvent } from "react";
import { Button } from "@mui/material";
import { useUpdate } from "react-admin";

interface QuickStatusToggleProps {
  record?: {
    id: number;
    actif: boolean;
  };
}

export const QuickStatusToggle = ({ record }: QuickStatusToggleProps) => {
  const [update, { isPending }] = useUpdate();

  if (!record) return null;

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    update(
      "employees",
      {
        id: record.id,
        data: { actif: !record.actif },
        previousData: record,
      },
      { mutationMode: "pessimistic" }
    );
  };

  return (
    <Button
      variant="contained"
      color={record.actif ? "error" : "success"}
      size="small"
      disabled={isPending}
      onClick={handleToggle}
    >
      {record.actif ? "Désactiver" : "Activer"}
    </Button>
  );
};
