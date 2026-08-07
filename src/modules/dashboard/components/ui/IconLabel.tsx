import Stack from "@mui/material/Stack";

export function IconLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {icon}
      {children}
    </Stack>
  );
}
