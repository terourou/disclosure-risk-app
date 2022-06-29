import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Data } from "../types/data";
import { calculate_matches, disRisk } from "../lib/disRisk";

import GaugeChart from "react-gauge-chart";

import { useRserve } from "@tmelliott/react-rserve";
import DisRiskR from "./DisRiskR/DisRiskR";
import Stat from "./widgets/Stat";

type Props = {
  data: Data | null;
  config: any;
};

interface InfoDialogProps {
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
    console.log(R);
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

  if (data === null || config.vars.length === 0)
    return (
      <div className="text-center">
        Results will appear here once you select one or more variables from the
        list.
      </div>
    );

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex items-center justify-center">
        <div className="flex flex-row gap-10 items-stretch">
          <div className="flex flex-col gap-5 items-center justify-center">
            <Stat value={data.data.length} name="observations" />
            <Stat
              value={Math.round(data.data.length / (config.sfrac || 1))}
              name="total population"
            />
          </div>
          <div className="flex flex-col gap-5 items-center justify-center">
            <Stat value={config.sfrac || 1} name="sampling fraction" unit="%" />
          </div>
          <div className="flex flex-col gap-5 items-center justify-center border-l pl-20 px-10">
            <Stat value={config.vars.length} name="variables" />
            <Stat value={matches.uniques} name="unique combinations" />
            <Stat value={matches.pairs} name="pairs" />
          </div>

          <div className="flex flex-col gap-4 items-center justify-center border-l pl-20 w-[360px]">
            <p>Estimated disclosure risk:</p>
            <GaugeChart
              id="gauge-chart4"
              nrOfLevels={10}
              arcPadding={0.1}
              cornerRadius={3}
              percent={risk / 100}
              textColor="black"
              animate={false}
            />
          </div>
        </div>

        {/* <Grid item md={6} lg={4}>
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

        </Grid> */}
      </div>

      <div className="flex-1">
        <div className="flex min-h-[200px] items-center flex-col flex-1 justify-center gap-8">
          {R &&
            R.running &&
            !Rfuns.calculate_risks &&
            (loadingR ? (
              <CircularProgress />
            ) : (
              <>
                <p className="text-slate-700">
                  For additional information, you can upload an unlabelled
                  version of your data to our server.
                </p>
                <div className="flex justify-center items-center gap-2">
                  <button
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    onClick={uploadData}
                  >
                    Upload to server
                  </button>
                  <button
                    type="button"
                    className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Details about uploading data
                  </button>
                </div>
              </>
            ))}
        </div>

        <DisRiskR funs={Rfuns} config={config} data={data} />
      </div>
    </div>
  );
};

export default DisclosureResults;
