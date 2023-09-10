import { useState } from "react";
import type { Config } from "~/types/Config";
import type { Data } from "~/types/Data";

export default function PopSize({
  data,
  config,
  setConfig,
}: {
  data: Data;
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
}) {
  const [sliderValue, setSliderValue] = useState<number>(config.sfrac * 100);
  const [sliderInterval, setSliderInterval] = useState<
    NodeJS.Timeout | undefined
  >(undefined);

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
          value={sliderValue}
          className="flex-1"
          onChange={(e) => {
            setSliderValue(parseInt(e.target.value));
            if (sliderInterval !== undefined) {
              clearTimeout(sliderInterval);
            }
            const id = setTimeout(() => {
              setConfig((c) => ({
                ...c,
                sfrac: sliderValue / 100,
              }));
            }, 100);
            setSliderInterval(id);
          }}
        />
        <div className="text-3xl font-bold">{Math.round(sliderValue)}%</div>
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
