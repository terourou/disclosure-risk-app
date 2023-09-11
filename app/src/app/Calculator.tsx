"use client";

import { useState } from "react";

import type { Data } from "~/types/Data";
import type { Config } from "~/types/Config";
import LoadData from "./data/LoadData";
import ViewData from "./data/ViewData";
import PopSize from "./config/PopSize";
import Variables from "./config/Variables";
import Guide from "./Guide";
import BasicResults from "./results/Basic";
import AdvancedResults from "./results/Advanced";

export default function Calculator() {
  const [data, setData] = useState<Data>();
  const [config, setConfig] = useState<Config>({
    vars: [],
    encvars: [],
    sfrac: 0.5,
  });

  return (
    <div className="flex w-full flex-col gap-8">
      {data === undefined ? (
        <LoadData setData={setData} />
      ) : (
        <div className="flex w-full flex-col rounded lg:flex-row">
          <div className="bg-gray-50 p-4 lg:w-1/2 xl:w-1/3">
            <ViewData data={data} clear={() => setData(undefined)} />
          </div>
          <div className="flex flex-1 flex-col items-center xl:flex-row">
            <div className="w-full flex-1 p-4">
              <PopSize data={data} config={config} setConfig={setConfig} />
            </div>
            <div className="w-full flex-1 p-4">
              <Variables data={data} config={config} setConfig={setConfig} />
            </div>
          </div>
        </div>
      )}

      {(!data || config.vars.length === 0) && <Guide data={data} />}

      {data && config.vars.length > 0 && (
        <>
          <BasicResults data={data} config={config} />
          <AdvancedResults data={data} config={config} />
        </>
      )}
    </div>
  );
}
