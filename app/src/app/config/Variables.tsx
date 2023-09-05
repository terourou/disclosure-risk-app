import { Config } from "~/types/Config";
import { Data } from "~/types/Data";

export default function Variables({
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
      <h5 className="font-bold">Select possible identification variables</h5>
      <p className="text-sm">
        These might be used alone or in combination with others to identify
        individuals.
      </p>
      <div className="my-2 flex flex-wrap items-center gap-2">
        {data.vars
          .filter((v) => v.field !== "id")
          .map((v) => (
            <label key={v.field} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.vars.includes(v.field)}
                className="peer hidden"
                onChange={(e) =>
                  setConfig((c) => ({
                    ...c,
                    vars: e.target.checked
                      ? [...c.vars, v.field]
                      : c.vars.filter((x) => x !== v.field),
                  }))
                }
              />
              <span className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-500 shadow hover:cursor-pointer peer-checked:bg-blue-200 peer-checked:text-black">
                {v.field}
              </span>
            </label>
          ))}
      </div>
    </>
  );
}
