import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";

import Papa from "papaparse";

type Props = {
  setter: any;
};

const LoadData = ({ setter }: Props) => {
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = (e: any) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    if (file === "") return;

    setLoading(true);
    Papa.parse(file, {
      complete: function (results) {
        const d = results.data.map((row: any, i) => {
          return {
            id: i,
            ...row,
          };
        });

        const keys = Object.keys(d[0]).map((key) => ({
          field: key,
          headerName: key,
          type: "string",
          editable: false,
          hide: key === "id",
        }));

        const types = keys
          .filter((k) => k.field !== "id")
          .map((k) => {
            const x = d.map((r) => r[k.field]);
            return x.every((el: string | number) => {
              if (typeof el !== "string") return false;
              if (el === "NA") return true;
              return !isNaN(parseFloat(el));
            })
              ? "number"
              : "string";
          });

        setter({ vars: keys, data: d, types: types });
        setLoading(false);
      },
      header: true,
      skipEmptyLines: true,
    });
  }, [file, setter]);

  if (loading) return <CircularProgress />;

  return (
    <Button
      sx={{
        height: "100%",
        width: "100%",
        backgroundColor: "#f9f9f9",
        border: "dashed 2px #dddddd",
      }}
      component="label"
    >
      Click to load data
      <input type="file" hidden onChange={loadData} />
    </Button>
  );
};

export default LoadData;
