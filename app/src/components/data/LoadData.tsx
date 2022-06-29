import { useEffect, useState } from "react";

import Papa from "papaparse";

type Props = {
  setter: any;
};

function distinct(value: any, index: number, self: any) {
  return self.indexOf(value) === index;
}

function encrypt(value: any, values: any) {
  return "X" + values.indexOf(value);
}

const LoadData = ({ setter }: Props) => {
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);

  const loadData = (e: any) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    if (file === "") return;

    setLoading(true);

    setTimeout(() => {
      Papa.parse(file, {
        complete: function (results) {
          const d = results.data.map((row: any, i) => {
            return {
              id: i,
              ...row,
            };
          });

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
              return x.every((el: string | number) => {
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
            encrypted: i === 0 ? v.field : "v" + i,
            values: d
              .map((x) => x[v.field])
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
              let rd: any = {};
              encArray.map((x) => {
                rd[x.encrypted] =
                  x.original === "id"
                    ? r[x.original]
                    : encrypt(r[x.original], x.values);
                return 0;
              });
              return rd;
            }),
            types: types.map((v, i) => (i === 0 ? v : "string")),
          };

          setter({ vars: keys, data: d, types: types, encrypted: encdata });
          setLoading(false);
        },
        header: true,
        skipEmptyLines: true,
      });
    }, 2000);
  }, [file, setter]);

  return (
    <label
      className={`h-full w-full bg-slate-600 flex flex-col gap-4 items-center justify-center rounded text-neutral-200 text-lg cursor-pointer drop-shadow-xl hover:bg-slate-700 transition-all p-4 text-center  ${
        loading && "animate-pulse"
      }`}
    >
      {loading ? (
        <>Loading ...</>
      ) : (
        <>
          <p className="uppercase text-neutral-100">
            To get started, click here to load a dataset
          </p>
          <p className="text-sm max-w-xl">
            Your data will not be uploaded to any servers yet. Basic
            functionality can be performed directly in your browser. You will be
            able to choose to upload a copy of your data later to a temporary R
            session. Details can be found on the 'About' page.
          </p>
          <input type="file" hidden onChange={loadData} />
        </>
      )}
    </label>
  );
};

export default LoadData;
