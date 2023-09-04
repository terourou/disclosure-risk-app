"use client";

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

import Papa, { ParseResult } from "papaparse";

import { clsx } from "clsx";
import { useCallback, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { Data, Row } from "~/types/Data";

type SetData = React.Dispatch<React.SetStateAction<Data | undefined>>;

const acceptedFileTypes: Accept = {
  "text/csv": ["*.csv"],
};

const distinct = (
  value: string | number,
  index: number,
  self: (string | number)[],
) => {
  return self.indexOf(value) === index;
};

const encrypt = (value: string | number, values: (string | number)[]) => {
  return "X" + values.indexOf(value.toString());
};

export default function LoadData({ setData }: { setData: SetData }) {
  const [loading, setLoading] = useState(false);

  const processData = useCallback(
    (d: Row[]) => {
      if (d.length === 0 || d[0] === undefined) {
        setLoading(false);
        return;
      }

      const keys = Object.keys(d[0]).map((key) => ({
        field: key,
        headerName: key,
        type: "string",
        editable: false,
        hide: key === "id",
      }));

      const types = keys
        .filter((k) => k.field !== "id")
        .map((k) => {
          const x = d.map((r) => r[k.field]);
          return x.every((el) => {
            if (typeof el !== "string") return false;
            if (el === "NA") return true;
            return !isNaN(parseFloat(el));
          })
            ? "number"
            : "string";
        });

      // encrypt data
      const encArray = keys.map((v, i) => ({
        original: v.field,
        encrypted: v.field === "id" ? v.field : "v" + i,
        values: d
          .map((x) => x[v.field] as string | number)
          .filter(distinct)
          .map((x) => x.toString()),
      }));

      const encdata = {
        vars: encArray.map((v) => ({
          field: v.encrypted,
          headerName: v.encrypted,
          type: v.original === "id" ? "number" : "string",
          editable: false,
          hide: v.original === "id",
        })),
        data: d.map((r) => {
          let rd: Row = {};
          encArray.map((x) => {
            rd[x.encrypted] =
              x.original === "id"
                ? (r[x.original] as number)
                : encrypt(r[x.original] as string | number, x.values);
            return 0;
          });
          return rd;
        }),
        types: types.map((v, i) => (i === 0 ? v : "string")),
      };

      setData({ vars: keys, data: d, types: types, encrypted: encdata });
      setLoading(false);
    },
    [setData],
  );

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<Row>) => {
        const d = results.data.map((row, i) => {
          return {
            id: i,
            ...row,
          };
        });

        processData(d);
      },
    });
  };

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop: handleDrop,
      accept: acceptedFileTypes,
      multiple: false,
    });

  return (
    <div className="relative flex w-full max-w-5xl flex-col gap-4 rounded border-dashed border-slate-100 bg-slate-600 p-8 text-center text-neutral-200">
      <p className="font-bold uppercase">Upload Dataset to begin</p>
      <div {...getRootProps()}>
        <section
          className={clsx(
            "w-full cursor-pointer rounded border border-dashed border-slate-100 bg-gray-500 p-12 text-center ",
            isDragReject && "border-red-300",
            isDragAccept && "border-green-300",
          )}
        >
          <input {...getInputProps()} />
          <p className="">
            Drag and drop file here to upload, or click to select a file.
          </p>
        </section>
      </div>

      <p className="text-sm">Supported file types: CSV</p>

      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded bg-slate-800 bg-opacity-50 backdrop-blur">
          <p className="">
            <ArrowDownTrayIcon className="h-16 animate-pulse" />
          </p>
          <p>Loading data into browser</p>
        </div>
      )}
    </div>
  );
}
