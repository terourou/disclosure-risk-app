"use client";

import { useState } from "react";
import { Config } from "~/types/Config";

import { Data } from "~/types/Data";
import LoadData from "./data/LoadData";
import ViewData from "./data/ViewData";
import PopSize from "./config/PopSize";
import Variables from "./config/Variables";

export default function Calculator() {
  const [data, setData] = useState<Data>();
  const [config, setConfig] = useState<Config>({
    vars: [],
    encvars: [],
    sfrac: 0.5,
  });

  if (!data) {
    // import data
    return <LoadData setData={setData} />;
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="flex w-full flex-col rounded lg:flex-row">
        <div className="h-96 bg-gray-50 p-4 lg:w-1/2 xl:w-1/3">
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
    </div>
  );
}
