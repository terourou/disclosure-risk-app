import { useEffect, useState } from "react";
import { Data } from "../types/data";
import { calculate_matches, disRisk } from "../lib/disRisk";

import GaugeChart from "react-gauge-chart";

import { useRserve } from "@tmelliott/react-rserve";
import DisRiskR from "./DisRiskR/DisRiskR";
import Stat from "./widgets/Stat";

function chunkArray(x: any, s: number) {
  const y = [];
  while (x.length > 0) {
    const chunk = x.splice(0, s);
    y.push(chunk);
  }
  return y;
}

type Props = {
  data: Data | null;
  config: any;
};

const DisclosureResults = ({ data, config }: Props) => {
  const [matches, setMatches] = useState({ uniques: 0, pairs: 0 });
  const [risk, setRisk] = useState(0);

  const [infoOpen, setInfoOpen] = useState(false);
  const openInfo = () => setInfoOpen(true);
  const closeInfo = () => setInfoOpen(false);

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

  const [loadingR, setLoadingR] = useState(-1);

  const [Rfuns, setRfuns] = useState<any>({});
  const [Rerror, setRerror] = useState<any>(null);

  const { R } = useRserve();

  const uploadData = () => {
    if (!R || !R.running) {
      setLoadingR(-1);
      setRfuns({});
      setRerror(null);
      return;
    }

    R.ocap(async (err: any, funs: any) => {
      if (!data || !data.encrypted || !funs.upload_data) return;
      setLoadingR(0);

      function uploadDataPromise(rows: any) {
        return new Promise((resolve, reject) => {
          funs.upload_data(rows, (err: any, value: any) => {
            if (err) return reject(err);
            resolve(value);
          });
        });
      }

      let chunkSize = Math.min(
        100,
        Math.max(1, Math.round(5000 / data.vars.length))
      );
      const chunks = chunkArray(data.encrypted.data, chunkSize);
      const ULproms = chunks.map(async (rows, i) => {
        await uploadDataPromise(rows).then(() => {
          if (i === chunks.length - 1 || i % 10 === 0)
            setLoadingR(i * chunkSize);
        });
        return 0;
      });

      await Promise.all(ULproms);

      funs.upload_data((err: any, value: any) => {
        if (err) setRerror(err);
        if (value) setRfuns({ calculate_risks: value.calculate_risks });
        setLoadingR(-1);
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
    <div className="flex flex-col gap-4">
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
            <Stat
              value={Math.round(1000 * config.sfrac || 1) / 10}
              name="sampling fraction"
              unit="%"
            />
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
      </div>

      <div className="flex-1">
        {Rerror ? (
          <div className="text-center mt-20">
            Sorry, it looks like there was an error sending or retrieving
            results from R.
          </div>
        ) : (
          R &&
          R.running &&
          !Rfuns.calculate_risks &&
          (loadingR >= 0 ? (
            <div className="text-lg h-[200px] flex flex-col gap-5 items-center justify-center">
              {loadingR < data.data.length - 1 ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 animate-rise"
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
                        width: `${(100 * (loadingR + 1)) / data.data.length}%`,
                      }}
                      className={`h-full bg-green-600 transition-all`}
                    ></div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-6">
                  <div className="w-10 h-10 border-4 border-green-600 border-solid rounded-full animate-spin border-t-transparent"></div>
                  Please wait while the server process the data.
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center flex-col flex-1 justify-center gap-8 min-h-[200px]">
              <p className="text-slate-700">
                For additional information, you can upload an unlabelled version
                of your data to our server.
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
                  onClick={openInfo}
                >
                  Details about uploading data
                </button>

                <div
                  className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto z-10 cursor-pointer flex items-center justify-center ${
                    !infoOpen && "hidden"
                  }`}
                  onClick={closeInfo}
                >
                  <div className="border-none shadow-lg relative flex flex-col pointer-events-auto cursor-default bg-white bg-clip-padding rounded-md outline-none text-current max-w-xl m-4">
                    <div className="flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
                      <h3 className="text-lg leading-6 text-gray-900">
                        Uploading Data
                      </h3>
                    </div>

                    <div className="relative p-4 flex flex-col gap-5 leading-6">
                      <p>
                        Uploading data to our server will provide addional
                        information:
                      </p>
                      <ul className="list-disc list-inside indent-4">
                        <li>Risk contributions of each variable</li>
                        <li>Individual risk of each row/observation</li>
                      </ul>
                      <p>
                        This information requires the use of methods in the R
                        package 'sdcMicro', and so cannot be performed locally.
                        We will load your data into memory on our server where
                        it will be accessible only from the current connection.
                        Once you close this page, the session and any uploaded
                        data will be deleted.
                      </p>

                      <h4 className="text-lg mt-2">Encryption of values</h4>
                      <p>
                        To further protect your data, we will encrypt the data
                        before uploading it. Since the R functionality does not
                        need to know specific values, the server{" "}
                        <em>will not</em> be able to decrypt the data.
                      </p>
                      <p>
                        To preview the encrypted version of the data that will
                        be sent to the server, use the toggle under the dataset
                        viewer above.
                      </p>
                    </div>

                    <div className="flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                      <button
                        type="button"
                        className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        onClick={closeInfo}
                      >
                        Got it!
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        <DisRiskR funs={Rfuns} config={config} data={data} />
      </div>
    </div>
  );
};

export default DisclosureResults;
