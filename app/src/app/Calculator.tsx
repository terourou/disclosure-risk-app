"use client";

import { useState } from "react";
import { Config } from "~/types/Config";

import { Data } from "~/types/Data";
import LoadData from "./data/Data";

export default function Calculator() {
  const [data, setData] = useState<Data>();
  const [config, setConfig] = useState<Config>();

  if (!data) {
    // import data
    return <LoadData setData={setData} />;
  }

  return <>YOU HAVE DATA!</>;
}
