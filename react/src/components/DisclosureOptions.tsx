import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { Data } from "../types/data";

export type Config = {
  vars: string[];
  encvars?: string[];
  sfrac?: number;
};

type Props = {
  data: Data | null;
  config: Config;
  handler: React.Dispatch<React.SetStateAction<Config>>;
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
  const handleVarChange = (event: SelectChangeEvent<string[]>) => {
    if (!data) return;

    const {
      target: { value },
    } = event;

    const newvars = typeof value === "string" ? value.split(",") : value;

    // figure out encrypted vars:
    const encvars = newvars
      .map((x) => data.vars.map((x) => x.field).indexOf(x))
      .map((i) => data.encrypted?.vars[i || 0].field || i.toString());

    handler({
      ...config,
      vars: newvars,
      encvars,
    });
  };

  const handleFracChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined
  ) => {
    if (event === undefined) return;

    const {
      target: { value },
    } = event;

    let x = parseFloat(value);
    if (!data) x = 1;
    else if (x > 1) x = data.data.length / x;

    handler({
      ...config,
      sfrac: x,
    });
  };

  if (data === null) return <></>;

  return (
    <div className="flex flex-col gap-4">
      <p>
        Select variables that might be used for identification either alone or
        in combination with others. What these are depends on your data. E.g.,
        for data on humans, variables like name, age, sex, address/location, or
        occupation might be used for identifiers; while for data on businesses,
        business name, size, address/location and industry might be used.
      </p>

      <p>
        Also enter the population size or sampling fraction for your data. E.g.,
        for a sample of adults in a region, enter the total number of adults in
        the region, or the fraction of adults in your sample.
      </p>

      {/* TODO: replace MUI components with tailwind CSS ones */}
      <div className="flex gap-2 flex-wrap">
        <div>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="select-variables-label">
              Choose variables
            </InputLabel>
            <Select
              labelId="select-variables-label"
              id="select-variables"
              multiple
              value={config.vars}
              onChange={(e) => handleVarChange(e)}
              input={
                <OutlinedInput
                  id="select-multiple-vars"
                  label="Choose variables"
                />
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value: string) => (
                    <Chip key={"var-" + value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {data.vars
                .filter((x, i) => x.field !== "id")
                .map((x) => (
                  <MenuItem key={x.field} value={x.field}>
                    {x.headerName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControl sx={{ m: 1, width: 300 }}>
            <TextField
              variant="outlined"
              label="Population size (or sampling fraction)"
              id="set-sampling-fraction"
              defaultValue={data ? data.data.length : 1}
              onChange={handleFracChange}
            />
          </FormControl>
        </div>
      </div>
    </div>
  );
};

export default DisclosureOptions;
