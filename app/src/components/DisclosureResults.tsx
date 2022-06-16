import { Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Data } from "../types/data";
import { calculate_matches, disRisk } from "../lib/disRisk";

type Props = {
  data: Data | null;
  config: any;
};

const DisclosureResults = ({ data, config }: Props) => {
  const [matches, setMatches] = useState({ uniques: 0, pairs: 0 });
  const [risk, setRisk] = useState(0);

  useEffect(() => {
    if (data === null || config.vars.length === 0) return;

    setMatches(
      calculate_matches(
        data.data.map((row: any) => config.vars.map((k: string) => row[k]))
      )
    );
  }, [data, config]);

  useEffect(() => {
    if (data === null) return;
    setRisk(disRisk(data.data.length / 5000, matches.uniques, matches.pairs));
  }, [data, matches, setRisk]);

  if (data === null || config.vars.length === 0) return <></>;

  return (
    <>
      <Typography variant="h5">Results</Typography>

      <Grid container spacing={2} sx={{ marginTop: "0.5em" }}>
        <Stack spacing={0}>
          <div>Number of observations: {data.data.length}</div>
          <div>Number of unique values: {matches.uniques}</div>
          <div>Number of pairs: {matches.pairs}</div>
          <div>Disclosure risk: {Math.round(100 * risk * 10) / 10}%</div>
        </Stack>
      </Grid>
    </>
  );
};

export default DisclosureResults;
