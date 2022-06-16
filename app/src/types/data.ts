import { GridColDef } from "@mui/x-data-grid";

export type Row = any;

export type Data = {
  vars: GridColDef[];
  data: Row[];
  types: string[];
};
