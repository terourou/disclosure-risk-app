import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { Data } from "~/types/Data";

export default function ViewData({
  data,
  clear,
}: {
  data: Data;
  clear: () => void;
}) {
  const [display, setDisplay] = useState<"raw" | "encrypted">("raw");

  return (
    <DataGrid
      rows={
        display === "raw" || !data.encrypted ? data.data : data.encrypted.data
      }
      columns={
        display === "raw" || !data.encrypted ? data.vars : data.encrypted.vars
      }
    />
  );
}
