import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Data } from "../../types/data";

import { motion } from "framer-motion";

type Props = {
  data: Data;
  clear: Function;
};

function ViewData({ data, clear }: Props) {
  const [display, setDisplay] = useState("raw");

  const toggleDataView = (
    event: React.ChangeEvent<HTMLInputElement> | undefined
  ) => {
    if (event === undefined) return;
    setDisplay(event.target.checked ? "enc" : "raw");
  };

  return (
    <motion.div
      className="w-full h-full flex flex-col gap-2"
      layoutId="data-panel"
      transition={{ duration: 1 }}
    >
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

      <motion.div
        className="flex justify-between flex-wrap items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 1 }}
      >
        <button
          className="px-4 py-2 bg-orange-600 text-orange-50 rounded shadow mb-2 mr-2"
          onClick={() => clear()}
        >
          Clear data
        </button>

        <label
          htmlFor="default-toggle"
          className="inline-flex items-center cursor-pointer"
        >
          <div className="relative">
            <input
              type="checkbox"
              value=""
              id="default-toggle"
              className="sr-only peer"
              onChange={toggleDataView}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 flex-1">
            Preview data as it will be uploaded to the server (with value
            information removed)
          </span>
        </label>
      </motion.div>
    </motion.div>
  );
}

export default ViewData;
