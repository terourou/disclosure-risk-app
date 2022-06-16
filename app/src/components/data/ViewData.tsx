import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Data } from "../../types/data";

type Props = {
  data: Data;
};

function ViewData({ data }: Props) {
  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <DataGrid rows={data.data} columns={data.vars} />
    </Box>
  );
}

export default ViewData;
