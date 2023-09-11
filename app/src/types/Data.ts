import type { GridColDef } from "@mui/x-data-grid";

export type Row = Record<string, string | number>;
// export type Row = {
//   [key: string]: string | number;
// }

type RawData = {
  vars: GridColDef[];
  data: Row[];
  types: string[];
};
export type Data = RawData & {
  encrypted: RawData;
};
