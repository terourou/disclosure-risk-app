"use client";

import { Config } from "~/types/Config";
import { Data, Row } from "~/types/Data";

import { useRserve } from "@tmelliott/react-rserve";
import { useEffect, useState } from "react";
import { DisRiskFuns, DisRiskResult } from "~/types/DisRisk";
import { AnimatePresence, motion } from "framer-motion";
import Boxplot, { computeBoxplotStats } from "react-boxplot";

import { interpolateHsl } from "d3";
import { DataGrid } from "@mui/x-data-grid";
import { round } from "./Basic";

export default function AdvancedResults({
  data,
  config,
}: {
  data: Data;
  config: Config;
}) {
  const { R } = useRserve();
  const [funs, setFuns] = useState<DisRiskFuns>({});

  const [infoOpen, setInfoOpen] = useState(false);
  const openInfo = () => setInfoOpen(true);
  const closeInfo = () => setInfoOpen(false);

  const uploadData = () => {
    R.ocap(
      async (
        err: any,
        funs: {
          upload_data?: (
            rows: Row[] | undefined,
            callback: (err: any, value: DisRiskFuns | undefined) => void,
          ) => void;
        },
      ) => {
        if (!data || !data.encrypted || !funs.upload_data) return;
        setLoadingProgress(0);

        function uploadDataPromise(rows: Row[]) {
          return new Promise((resolve, reject) => {
            if (!funs.upload_data) return reject("No upload_data function");
            funs.upload_data(rows, (err, value) => {
              if (err) return reject(err);
              resolve(value);
            });
          });
        }

        let chunkSize = Math.min(
          100,
          Math.max(1, Math.round(5000 / data.vars.length)),
        );
        const chunks = chunkArray(data.encrypted.data, chunkSize);
        const ULproms = chunks.map(async (rows, i) => {
          await uploadDataPromise(rows).then(() => {
            if (i === chunks.length - 1 || i % 10 === 0)
              setLoadingProgress(i * chunkSize);
          });
          return 0;
        });

        await Promise.all(ULproms);

        funs.upload_data(undefined, (err, value) => {
          if (err) setError(err);
          if (value) setFuns({ calculate_risks: value.calculate_risks });
          setLoadingProgress(undefined);
        });
      },
    );
  };
  const [loadingProgress, setLoadingProgress] = useState<number>();
  const [error, setError] = useState<string>();

  if (!R || !R.running) return <></>;

  if (loadingProgress !== undefined) {
    return (
      <div className="mx-auto my-20 flex w-full max-w-4xl flex-col items-center gap-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 animate-pulse"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <p className="text-slate-700">Uploading data ...</p>

        <div className="h-4 w-full rounded-full bg-gray-300">
          <div
            style={{
              width: `${(100 * (loadingProgress + 1)) / data.data.length}%`,
            }}
            className={`h-full rounded-full bg-green-600 transition-all`}
          ></div>
        </div>
      </div>
    );
  }

  if (funs.calculate_risks) {
    return (
      <DisplayResults
        calculate_risks={funs.calculate_risks}
        data={data}
        config={config}
      />
    );
  }

  return (
    <div className="flex min-h-[200px] flex-1 flex-col items-center justify-center gap-8">
      <p className="text-slate-700">
        For additional information, you can upload an unlabelled version of your
        data to our server.
      </p>
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={uploadData}
        >
          Upload to server
        </button>
        <button
          type="button"
          className="mb-2 mr-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
          onClick={openInfo}
        >
          Details about uploading data
        </button>

        <div
          className={`fixed inset-0 z-10 flex cursor-pointer items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50 ${
            !infoOpen && "hidden"
          }`}
          onClick={closeInfo}
        >
          <div className="pointer-events-auto relative m-4 flex max-w-xl cursor-default flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none">
            <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b border-gray-200 p-4">
              <h3 className="text-lg leading-6 text-gray-900">
                Uploading Data
              </h3>
            </div>

            <div className="relative flex flex-col gap-5 p-4 leading-6">
              <p>
                Uploading data to our server will provide addional information:
              </p>
              <ul className="list-inside list-disc indent-4">
                <li>Risk contributions of each variable</li>
                <li>Individual risk of each row/observation</li>
              </ul>
              <p>
                This information requires the use of methods in the R package
                'sdcMicro', and so cannot be performed locally. We will load
                your data into memory on our server where it will be accessible
                only from the current connection. Once you close this page, the
                session and any uploaded data will be deleted.
              </p>

              <h4 className="mt-2 text-lg">Encryption of values</h4>
              <p>
                To further protect your data, we will encrypt the data before
                uploading it. Since the R functionality does not need to know
                specific values, the server <em>will not</em> be able to decrypt
                the data.
              </p>
              <p>
                To preview the encrypted version of the data that will be sent
                to the server, use the toggle under the dataset viewer above.
              </p>
            </div>

            <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t border-gray-200 p-4">
              <button
                type="button"
                className="mb-2 mr-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                onClick={closeInfo}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function chunkArray(x: Row[], s: number) {
  const y = [];
  while (x.length > 0) {
    const chunk = x.splice(0, s);
    y.push(chunk);
  }
  return y;
}

function DisplayResults({
  calculate_risks,
  data,
  config,
}: {
  calculate_risks: DisRiskFuns["calculate_risks"];
  data: Data;
  config: Config;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DisRiskResult>();

  useEffect(() => {
    if (!calculate_risks) return;

    setLoading(true);
    calculate_risks(
      {
        sfrac: config.sfrac,
        vars: config.encvars,
      },
      (err, value) => {
        if (err) console.error(err);
        setResult({
          ...value,
          var_contrib: value.var_contrib.map((x, i) => ({
            ...x,
            v: config.vars[i] as string,
          })),
        });
        setLoading(false);
      },
    );
  }, [config, calculate_risks]);

  if (!result)
    return loading ? (
      <div className="my-12 flex flex-col items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-8 border-gray-200 border-t-blue-700"></div>
      </div>
    ) : (
      <></>
    );

  return (
    <div className="mx-auto mt-8 flex w-full max-w-6xl flex-col gap-12 border-t px-8 pt-8 lg:flex-row">
      <div className="flex-1">
        <VariableResults contributions={result.var_contrib} />
      </div>
      <div className="flex-1">
        <RowResults data={data} config={config} risks={result.indiv_risk} />
      </div>
    </div>
  );
}

const VariableResults = ({
  contributions,
}: {
  contributions: DisRiskResult["var_contrib"];
}) => {
  return (
    <div className="flex flex-col">
      <div className="table">
        <div className="table-row">
          <div className="table-cell border-r border-r-white pr-2 text-right align-middle"></div>
          <div className="table-cell h-full w-full py-1 pr-2 font-bold">
            Variable contributions to overall risk
          </div>
        </div>

        <AnimatePresence>
          {contributions
            .sort((x1, x2) => (x1.c < x2.c ? 1 : -1))
            .map(({ v, c }) => (
              <motion.div
                key={v}
                className="table-row h-[18px]"
                initial={{ opacity: 0, transform: "scaleY(0)" }}
                animate={{ opacity: 1, transform: "scaleY(1)" }}
                exit={{ opacity: 0, transform: "scaleY(0)" }}
              >
                <div className="table-cell border-r border-r-white pr-2 text-right align-middle">
                  {v}
                </div>
                <div className="table-cell h-full w-full py-1 pr-2">
                  <div
                    className="linear h-full transition-all duration-1000"
                    style={{
                      width: c + "%",
                      background: barCol(c / 100),
                    }}
                  ></div>
                </div>
                <div className="align-center table-cell align-middle">
                  {round(c, 1)}%
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const barCol = interpolateHsl("#18c618", "#cd2020");

const RowResults = ({
  data,
  config,
  risks,
}: {
  data: Data;
  config: Config;
  risks: DisRiskResult["indiv_risk"];
}) => {
  const cols = [
    {
      field: "row",
      headerName: "Row Number",
      type: "number",
      hide: false,
    },
    {
      field: "risk",
      headerName: "Risk (%)",
      type: "number",
      hide: false,
    },
    ...data.vars.filter((x) => config.vars.indexOf(x.field) !== -1),
  ];

  const rows = data.data.map((x, i) => ({
    ...x,
    row: i + 1,
    risk: round((risks[i] || 0) * 100, 1),
  }));

  return (
    <div className="flex flex-col gap-8">
      <h5 className="font-bold">Row/observation risks</h5>

      <div className="w-full px-8">
        <div className="relative mx-auto my-1 w-full pb-1">
          <Boxplot
            width={400}
            height={20}
            orientation="horizontal"
            min={0}
            max={100}
            stats={computeBoxplotStats(risks.map((x: number) => x * 100))}
          />

          {[0, 20, 40, 60, 80, 100].map((x) => (
            <div
              className="b-0 absolute h-[10px] border-l border-l-black"
              style={{ left: x + "%" }}
              key={"percent-" + x}
            >
              <div className="b-0 absolute translate-x-[-50%] translate-y-[10px] text-xs">
                {x}%
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 h-[300px] bg-slate-50 drop-shadow">
        <DataGrid
          rows={rows}
          columns={cols}
          density="compact"
          sortModel={[{ field: "risk", sort: "desc" }]}
        />
      </div>
    </div>
  );
};
