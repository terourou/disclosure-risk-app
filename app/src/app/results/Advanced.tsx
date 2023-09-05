"use client";

import { Config } from "~/types/Config";
import { Data, Row } from "~/types/Data";

import { useRserve } from "@tmelliott/react-rserve";
import { useEffect, useState } from "react";
import { DisRiskFuns, DisRiskResult } from "~/types/DisRisk";

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

  if (!R) {
    return <p>Connecting to R...</p>;
  }

  if (!R.running) {
    return <p>Starting R...</p>;
  }

  if (loadingProgress !== undefined) {
    return (
      <div className="flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="animate-rise h-10 w-10"
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

        <div className="h-1 w-full bg-gray-300">
          <div
            style={{
              width: `${(100 * (loadingProgress + 1)) / data.data.length}%`,
            }}
            className={`h-full bg-green-600 transition-all`}
          ></div>
        </div>
      </div>
    );
  }

  if (funs.calculate_risks) {
    return (
      <DisplayResults calculate_risks={funs.calculate_risks} config={config} />
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
  config,
}: {
  calculate_risks: DisRiskFuns["calculate_risks"];
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
        vars: config.vars,
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

  if (!result) return <></>;
  if (loading) return <>Loading...</>;

  return <>RESULTS</>;
}
