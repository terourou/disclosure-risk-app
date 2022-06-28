import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Data } from "../types/data";
import { calculate_matches, disRisk } from "../lib/disRisk";

import GaugeChart from "react-gauge-chart";

import { useRserve } from "@tmelliott/react-rserve";
import DisRiskR from "./DisRiskR/DisRiskR";

type Props = {
  data: Data | null;
  config: any;
};

export interface InfoDialogProps {
  open: boolean;
  onClose: () => void;
}

function InfoDialog(props: InfoDialogProps) {
  const { open, onClose } = props;

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Uploading Data</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <p>Uploading data to our server will provide addional information:</p>
          <ul>
            <li>Individual risk (i.e., row numbers)</li>
            <li>...</li>
          </ul>
          <p>
            This information requires the use of methods in the R package
            'sdcMicro', and so cannot be performed locally. We will load your
            data into memory on our server where it will be accessibly only from
            the current connection. Once you close this page, the data will be
            deleted.
          </p>
          <h4>Encryption of values</h4>
          <p>
            To further protect your data, we will encrypt the data before
            uploading it. Since the R functionality does not need to know
            specific values, the server <em>will not</em> be able to decrypt the
            data.
          </p>
          <p>
            To preview the encrypted version of the data that will be sent to
            the server, use the toggle under the dataset viewer above.
          </p>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

const DisclosureResults = ({ data, config }: Props) => {
  const [matches, setMatches] = useState({ uniques: 0, pairs: 0 });
  const [risk, setRisk] = useState(0);

  const [infoOpen, setInfoOpen] = useState(false);

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

  const [loadingR, setLoadingR] = useState(false);
  const [Rfuns, setRfuns] = useState<any>({});

  const R = useRserve();

  const uploadData = () => {
    if (!R || !R.running) return;
    R.ocap((err: any, funs: any) => {
      if (!data || !data.encrypted || !funs.upload_data) return;
      setLoadingR(true);
      funs.upload_data(data.encrypted.data, (err: any, value: any) => {
        setRfuns({ calculate_risks: value.calculate_risks });
        setLoadingR(false);
      });
    });
  };

  if (data === null || config.vars.length === 0) return <></>;

  return (
    <>
      <Typography variant="h5">Results</Typography>

      <Grid
        container
        columnSpacing={10}
        sx={{ marginTop: "0.5em", display: "flex" }}
      >
        <Grid item md={6} lg={4}>
          <Stack spacing={0}>
            <div>Number of observations: {data.data.length}</div>
            <div>Sampling fraction: {config.sfrac || 1}</div>
            <div>Population size: {data.data.length / (config.sfrac || 1)}</div>
            <div>Number of unique values: {matches.uniques}</div>
            <div>Number of pairs: {matches.pairs}</div>
            <div>Disclosure risk: {risk}%</div>
          </Stack>
        </Grid>

        <Grid item md={6} lg={4}>
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

        <Grid item md={6} lg={4}>
          {R &&
            R.running &&
            !Rfuns.calculate_risks &&
            (loadingR ? (
              <CircularProgress />
            ) : (
              <>
                <p>
                  For additional information, you can upload an encrypted
                  version of your data to our server.
                </p>
                <Stack spacing={2} direction="row">
                  <Button variant="contained" onClick={uploadData}>
                    Upload to server
                  </Button>
                  <Button variant="outlined" onClick={() => setInfoOpen(true)}>
                    Find out more
                  </Button>
                </Stack>
                <InfoDialog
                  open={infoOpen}
                  onClose={() => setInfoOpen(false)}
                />
              </>
            ))}
        </Grid>
      </Grid>

      <DisRiskR funs={Rfuns} config={config} data={data} />
    </>
  );
};

export default DisclosureResults;
