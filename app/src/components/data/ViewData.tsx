import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Data } from "../../types/data";

type Props = {
  data: Data;
};

function ViewData({ data }: Props) {
  const [display, setDisplay] = useState("raw");

  const toggleDataView = (event: any) => {
    setDisplay(event.target.checked ? "enc" : "raw");
  };

  return (
    <>
      <div className="w-full h-full flex flex-col gap-2 items-end">
        <div className="w-full flex-1 bg-slate-50">
          {/* TODO: convert this to plain CSS table with https://flowbite.com/docs/components/tables/ */}
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

        <label
          htmlFor="default-toggle"
          className="inline-flex relative items-center cursor-pointer"
        >
          <input
            type="checkbox"
            value=""
            id="default-toggle"
            className="sr-only peer"
            onChange={toggleDataView}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            Preview data as it will be uploaded to the server (with value
            information removed)
          </span>
        </label>
      </div>
    </>
  );
}

export default ViewData;
