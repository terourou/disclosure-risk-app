import { Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Data } from "../types/data";
import { calculate_matches, disRisk } from "../lib/disRisk";

import GaugeChart from "react-gauge-chart";

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
    setRisk(
      Math.round(
        100 * disRisk(config.sfrac, matches.uniques, matches.pairs) * 10
      ) / 10
    );
  }, [data, matches, setRisk, config]);

  if (data === null || config.vars.length === 0) return <></>;

  return (
    <>
      <Typography variant="h5">Results</Typography>

      <Grid container spacing={10} sx={{ marginTop: "0.5em", display: "flex" }}>
        <Stack spacing={0}>
          <div>Number of observations: {data.data.length}</div>
          <div>Sampling fraction: {config.sfrac || 1}</div>
          <div>Population size: {data.data.length / (config.sfrac || 1)}</div>
          <div>Number of unique values: {matches.uniques}</div>
          <div>Number of pairs: {matches.pairs}</div>
          <div>Disclosure risk: {risk}%</div>
        </Stack>

        <Grid item xs={4}>
          <GaugeChart
            id="gauge-chart4"
            nrOfLevels={10}
            arcPadding={0.1}
            cornerRadius={3}
            percent={risk / 100}
            textColor="black"
            animate={false}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DisclosureResults;
