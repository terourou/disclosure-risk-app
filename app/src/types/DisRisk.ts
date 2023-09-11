export type DisRiskFuns = {
  calculate_risks?: (
    args: { sfrac: number; vars: string[] },
    callback: (err: any, value: DisRiskResult) => void,
  ) => void;
};

export type DisRiskResult = {
  indiv_risk: number[];
  var_contrib: { v: string; c: number }[];
};
