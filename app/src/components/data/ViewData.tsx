import { Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { MouseEvent, useState } from "react";
import { Data } from "../../types/data";

type Props = {
  data: Data;
};

function ViewData({ data }: Props) {
  const [display, setDisplay] = useState("raw");

  const toggleHandler = (
    event: MouseEvent<HTMLElement>,
    newDisplay: string
  ) => {
    setDisplay(newDisplay);
  };

  return (
    <>
      <Stack
        spacing={1}
        sx={{
          height: "100%",
          width: "100%",
        }}
      >
        {display === "raw" || !data.encrypted ? (
          <DataGrid rows={data.data} columns={data.vars} />
        ) : (
          <DataGrid rows={data.encrypted.data} columns={data.encrypted.vars} />
        )}

        <ToggleButtonGroup
          color="primary"
          value={display}
          exclusive
          size="small"
          onChange={toggleHandler}
          sx={{ justifyContent: "flex-end" }}
        >
          <ToggleButton value="raw">Raw data</ToggleButton>
          <ToggleButton value="enc">Encrypted data</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </>
  );
}

export default ViewData;
