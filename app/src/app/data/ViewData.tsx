import { DataGrid } from "@mui/x-data-grid";
import clsx from "clsx";
import { useState } from "react";
import type { Data } from "~/types/Data";

export default function ViewData({
  data,
  clear,
}: {
  data: Data;
  clear: () => void;
}) {
  const [display, setDisplay] = useState<"raw" | "encrypted">("raw");

  return (
    <div className="flex flex-col gap-2">
      <div className="h-96">
        <DataGrid
          rows={
            display === "raw" || !data.encrypted
              ? data.data
              : data.encrypted.data
          }
          columns={
            display === "raw" || !data.encrypted
              ? data.vars
              : data.encrypted.vars
          }
        />
      </div>
      <div className="flex justify-between gap-4">
        <button
          className="rounded bg-red-600 px-2 py-1 text-sm font-bold text-gray-100 shadow"
          onClick={clear}
        >
          Clear
        </button>

        <div className="flex gap-2">
          Display data as
          <div className="flex">
            <button
              className={clsx(
                "rounded-l px-2 py-1 text-sm font-bold shadow disabled:cursor-not-allowed",
                display !== "raw"
                  ? "bg-gray-300 text-gray-50"
                  : "bg-gray-600 text-gray-100",
              )}
              onClick={() => setDisplay("raw")}
              disabled={display === "raw"}
            >
              Original
            </button>
            <button
              className={clsx(
                "rounded-r px-2 py-1 text-sm font-bold shadow disabled:cursor-not-allowed",
                display !== "encrypted"
                  ? "bg-gray-300 text-gray-50"
                  : "bg-gray-600 text-gray-100",
              )}
              onClick={() => setDisplay("encrypted")}
              disabled={display === "encrypted"}
            >
              Delabelled
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
