import {
  Box,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { Data } from "../types/data";

type Props = {
  data: Data | null;
  config: any;
  handler: any;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const DisclosureOptions = ({ data, config, handler }: Props) => {
  const handleVarChange = (event: SelectChangeEvent<string>) => {
    const {
      target: { value },
    } = event;

    const newvars = typeof value === "string" ? value.split(",") : value;

    // figure out encrypted vars:
    const encvars = newvars
      .map((x) => data?.vars.map((x) => x.field).indexOf(x))
      .map((i) => data?.encrypted?.vars[i || 0].field || i);

    handler({
      ...config,
      vars: newvars,
      encvars,
    });
  };

  const handleFracChange = (event: any) => {
    let {
      target: { value },
    } = event;

    if (!data) value = 1;
    else if (value > 1) value = data.data.length / value;

    handler({
      ...config,
      sfrac: value,
    });
  };

  if (data === null) return <></>;

  return (
    <>
      <Typography variant="h5">Configuration</Typography>

      <Grid container spacing={2} sx={{ marginTop: "0.5em" }}>
        <Grid item md={6} lg={4}>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="select-variables-label">
              Choose variables
            </InputLabel>
            <Select
              labelId="select-variables-label"
              id="select-variables"
              multiple
              value={config.vars}
              onChange={handleVarChange}
              input={
                <OutlinedInput
                  id="select-multiple-vars"
                  label="Choose variables"
                />
              }
              renderValue={(selected: any) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value: string) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {data.vars
                .filter(
                  (x, i) => x.field !== "id" && data.types[i - 1] === "string"
                )
                .map((x) => (
                  <MenuItem key={x.field} value={x.field}>
                    {x.headerName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={6} lg={4}>
          <FormControl sx={{ m: 1, width: 300 }}>
            <TextField
              variant="outlined"
              label="Sampling fraction / population size"
              id="set-sampling-fraction"
              defaultValue={1}
              onChange={handleFracChange}
            />
          </FormControl>
        </Grid>
      </Grid>
    </>
  );
};

export default DisclosureOptions;
