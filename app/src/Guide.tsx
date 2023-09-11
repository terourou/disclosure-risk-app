import type { Data } from "./types/Data";
import clsx from "clsx";

export default function Guide({ data }: { data?: Data }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col">
      <h5 className="mb-4 font-bold uppercase">Quick start guide</h5>

      <ol className="max-w-lg list-decimal space-y-4">
        <li className={clsx(data && "text-gray-400 line-through")}>
          <p className="font-bold">Load a dataset from your computer.</p>
          <p className={clsx("text-sm", data && "hidden")}>
            Your data will not be uploaded to any servers yet. Basic
            functionality is performed directly in your browser. You will be
            able to choose to upload a copy of your data later for additional
            information.
          </p>
        </li>

        <li>
          <p className="font-bold">
            Specify sampling fraction and select variables.
          </p>
          <p className={clsx("text-sm", data ? "block" : "hidden")}>
            Enter the population size or sampling fraction for your data. E.g.,
            for a sample of adults in a region, enter the total number of adults
            in the region, or the fraction of adults in your sample.
          </p>
          <p className={clsx("mt-2 text-sm", data ? "block" : "hidden")}>
            Select variables that might be used for identification either alone
            or in combination with others. What these are depends on your data.
            E.g., for data on humans, variables like name, age, sex,
            address/location, or occupation might be used for identifiers; while
            for data on businesses, business name, size, address/location and
            industry might be used.
          </p>
        </li>
      </ol>
    </div>
  );
}
