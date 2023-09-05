/**
 * Calculates the disclosure risk from a given sampling fraction, number of uniques,
 * and number of pairs.
 *
 * @param sampling_fraction {number} The sampling fraction of the sample
 * @param n_unique {number} The number of unique values
 * @param n_pairs {number} The number of pairs of values
 * @returns The disclosure risk
 */
export function disRisk(
  sampling_fraction: number,
  n_unique: number,
  n_pairs: number,
): number {
  return (
    (n_unique * sampling_fraction) /
    (n_unique * sampling_fraction + n_pairs * (1 - sampling_fraction))
  );
}

/**
 *
 * @param data array of data
 * @returns Tumber of sample uniques and paired observations in the data set.
 */
export function calculate_matches(data: (string | number)[][]): {
  uniques: number;
  pairs: number;
} {
  const values = data.map((row) => Object.values(row).join("|"));
  const table = values.reduce(
    (acc, e: string) => acc.set(e, (acc.get(e) || 0) + 1),
    new Map<string, number>(),
  );

  let uniques = 0,
    pairs = 0;

  const tarr = Array.from(table, ([name, value]) => value);

  tarr.map((x: number) => {
    if (x === 1) uniques++;
    if (x === 2) pairs++;
    return 0;
  });

  pairs *= 2;

  return {
    uniques,
    pairs,
  };
}
