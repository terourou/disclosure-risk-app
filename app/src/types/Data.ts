import { GridColDef } from "@mui/x-data-grid";

export type Row = {
  [key: string]: string | number;
};

export type Data = {
  vars: GridColDef[];
  data: Row[];
  types: string[];
  encrypted?: Data;
};
