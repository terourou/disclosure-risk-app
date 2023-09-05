import { Data } from "~/types/Data";
import Stat from "../Stat";
import { Config } from "~/types/Config";
import { calculate_matches, disRisk } from "./DisRisk";

export default function BasicResults({
  data,
  config,
}: {
  data: Data;
  config: Config;
}) {
  const { uniques, pairs } = calculate_matches(
    data.data.map((row) => config.vars.map((k) => row[k] ?? 0)),
  );
  const risk = disRisk(config.sfrac, uniques, pairs) * 100;

  return (
    <div className="mx-auto flex w-full max-w-5xl items-center justify-center gap-20">
      <div className="flex items-center justify-center gap-12 border-r pr-16">
        <Stat value={config.vars.length} label="Variables" />
        <Stat value={uniques} label="Unique values" />
        <Stat value={pairs} label="Pairs" />
      </div>
      <div className="flex flex-col items-center">
        <p className="uppercase">Estimated disclosure risk</p>
        <p className="text-6xl font-bold">{round(risk, 1)}%</p>
      </div>
    </div>
  );
}

const round = (n: number, dp: number) => Math.round(n * 10 ** dp) / 10 ** dp;
