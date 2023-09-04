import { Config } from "~/types/Config";
import { Data } from "~/types/Data";

export default function PopSize({
  data,
  config,
  setConfig,
}: {
  data: Data;
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
}) {
  return (
    <>
      <h5 className="font-bold">Specify population sampling fraction</h5>
      <p className="text-sm">
        Enter the sampling fraction (% of total population included in sample)
        or the total population size.
      </p>

      <div className="my-4 flex gap-8 px-8">
        <input
          type="range"
          min={1}
          max={100}
          step={1}
          value={config.sfrac * 100}
          className="flex-1"
          onChange={(e) =>
            setConfig((c) => ({
              ...c,
              sfrac: parseInt(e.target.value) / 100,
            }))
          }
        />
        <div className="text-3xl font-bold">
          {Math.round(config.sfrac * 100)}%
        </div>
      </div>

      <div className="flex gap-8 px-8">
        <label>Population size:</label>
        <input
          type="number"
          value={Math.round(data.data.length * (1 / config.sfrac))}
          onChange={(e) =>
            setConfig((c) => ({
              ...c,
              sfrac: data.data.length / parseInt(e.target.value),
            }))
          }
        />
      </div>
    </>
  );
}
