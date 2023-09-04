import { Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Boxplot, { computeBoxplotStats } from "react-boxplot";
import { Data, Row } from "../../types/data";

import { interpolateHsl } from "d3";
import { AnimatePresence, motion } from "framer-motion";
import { Config } from "../DisclosureOptions";

export type DisRiskFuns = {
  calculate_risks?: (
    args: { sfrac: number; vars: string[] },
    callback: (err: any, value: DisRiskResult) => void
  ) => void;
};

type DisRiskResult = {
  indiv_risk: number[];
  var_contrib: { v: string; c: number }[];
};

type DisRiskRData = {
  cols: GridColDef[];
  rows: (Row & { row: number; risk: number })[];
};

type Props = {
  funs: DisRiskFuns;
  config: Config;
  data: Data | null;
};

export default function DisRiskR({ funs, config, data }: Props) {
  const [res, setRes] = useState<DisRiskResult>();
  const [rData, setRData] = useState<DisRiskRData>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!funs || !funs.calculate_risks) return;
    if (!config || !config.sfrac || !config.vars || !config.encvars) return;
    setLoading(true);
    funs.calculate_risks(
      { sfrac: config.sfrac, vars: config.encvars },
      (err: any, value: DisRiskResult) => {
        // re-label variables
        value.var_contrib = value.var_contrib.map((x, i) => ({
          ...x,
          v: config.vars[i],
        }));
        setRes(value);
      }
    );
  }, [funs, setRes, config]);

  useEffect(() => {
    if (data && res) {
      setRData({
        cols: [
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
        ],
        rows: data.data.map((x, i) => ({
          ...x,
          row: i + 1,
          risk: Math.round(res.indiv_risk[i] * 1000) / 10,
        })),
      });
    }
    setLoading(false);
  }, [res, config, data]);

  const barCol = interpolateHsl("#00FF00", "#FF0000");

  if (!res) return <></>;

  return (
    <div className="flex justify-center items-center border-t pt-2">
      {loading ? (
        <div className="h-[200px] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 animate-sink"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-2 w-full items-center lg:items-start justify-center transition-all lienar duration-500">
          {res.var_contrib && (
            <div className="bg-slate-800 rounded-lg text-white p-4 m-4 min-w-[360px] flex flex-col gap-4">
              <h5 className="text-lg font-bold">
                Variable contributions to overall risk
              </h5>

              <div className="table">
                <AnimatePresence>
                  {res.var_contrib
                    .sort((x1, x2) => (x1.c < x2.c ? 1 : -1))
                    .map(({ v, c }) => (
                      <motion.div
                        key={v}
                        className="table-row h-[18px]"
                        initial={{ opacity: 0, transform: "scaleY(0)" }}
                        animate={{ opacity: 1, transform: "scaleY(1)" }}
                        exit={{ opacity: 0, transform: "scaleY(0)" }}
                      >
                        <div className="table-cell text-right border-r border-r-white pr-2 align-middle">
                          {v}
                        </div>
                        <div className="table-cell w-full h-full py-1 pr-2">
                          <div
                            className="h-full transition-all linear duration-1000"
                            style={{
                              width: c + "%",
                              background: barCol(c / 100),
                            }}
                          ></div>
                        </div>
                        <div className="table-cell">
                          <Typography variant="caption">
                            {Math.round(c * 10) / 10}%
                          </Typography>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {res.indiv_risk && (
            <div className="bg-green-100 rounded-lg py-4 px-8 m-4 min-w-[360px] flex flex-col gap-4">
              <h5 className="text-lg font-bold">Row/observation risks</h5>

              <div className="mx-auto my-1 pb-1 relative w-[400px]">
                <Boxplot
                  width={400}
                  height={20}
                  orientation="horizontal"
                  min={0}
                  max={100}
                  stats={computeBoxplotStats(
                    res.indiv_risk.map((x: number) => x * 100)
                  )}
                />

                {[0, 20, 40, 60, 80, 100].map((x) => (
                  <div
                    className="absolute b-0 border-l border-l-black h-[10px]"
                    style={{ left: x + "%" }}
                    key={"percent-" + x}
                  >
                    <div className="text-xs absolute b-0 translate-y-[10px] translate-x-[-50%]">
                      {x}%
                    </div>
                  </div>
                ))}
              </div>

              {rData && (
                <div className="mt-2 h-[300px] w-[500px] 2xl:w-[700px] bg-slate-50 drop-shadow">
                  <DataGrid
                    rows={rData.rows}
                    columns={rData.cols}
                    density="compact"
                    sortModel={[{ field: "risk", sort: "desc" }]}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
