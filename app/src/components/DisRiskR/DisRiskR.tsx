import { CircularProgress, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Boxplot, { computeBoxplotStats } from "react-boxplot";
import { Data } from "../../types/data";

type Props = {
  funs: any;
  config: any;
  data: Data | null;
};

export default function DisRiskR({ funs, config, data }: Props) {
  const [res, setRes] = useState<any | null>(null);
  const [rData, setRData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!funs || !funs.calculate_risks) return;
    setLoading(true);
    funs.calculate_risks(
      { sfrac: config.sfrac, vars: config.encvars },
      (err: any, value: any) => {
        // re-label variables
        value.var_contrib = value.var_contrib.map((x: any, i: number) => ({
          ...x,
          v: config.vars[i],
        }));
        setRes(value);
      }
    );
  }, [funs, setRes, config]);

  useEffect(() => {
    if (data && res) {
      setRData({
        cols: [
          {
            field: "row",
            headerName: "Row Number",
            type: "number",
            hide: false,
          },
          {
            field: "risk",
            headerName: "Risk (%)",
            type: "number",
            hide: false,
          },
          ...data.vars.filter((x) => config.vars.indexOf(x.field) !== -1),
        ],
        rows: data.data.map((x: any, i: number) => ({
          ...x,
          row: i + 1,
          risk: Math.round(res.indiv_risk[i] * 1000) / 10,
        })),
      });
    }
    setLoading(false);
  }, [res, config, data]);

  console.log(rData);

  if (!res) return <></>;

  return (
    <Box
      sx={{
        marginTop: 1,
        paddingTop: 1,
        borderTop: "solid 1px #f0f0f0",
      }}
    >
      <Typography variant="h6">
        Extended results from R package 'sdcMicro'
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {res.var_contrib && (
            <Grid item lg={4}>
              <Typography variant="subtitle1">
                Variable contributions
              </Typography>

              <table>
                <tbody>
                  {res.var_contrib
                    .sort((x1: any, x2: any) => (x1.c < x2.c ? 1 : -1))
                    .map(({ v, c }: any) => (
                      <tr key={v}>
                        <td>{v}</td>
                        <td width="99%" height="18px">
                          <div
                            style={{
                              width: c + "%",
                              height: "100%",
                              background: "#e68d8d",
                            }}
                          ></div>
                        </td>
                        <td>
                          <Typography variant="caption">
                            {Math.round(c * 10) / 10}%
                          </Typography>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Grid>
          )}

          {res.indiv_risk && (
            <Grid item lg={8}>
              <Typography variant="subtitle1">Individual risks</Typography>

              <Box
                sx={{
                  margin: "1em auto",
                  paddingBottom: "1em",
                  position: "relative",
                  width: "400px",
                }}
              >
                <Boxplot
                  width={400}
                  height={20}
                  orientation="horizontal"
                  min={0}
                  max={100}
                  stats={computeBoxplotStats(
                    res.indiv_risk.map((x: number) => x * 100)
                  )}
                />

                {[0, 20, 40, 60, 80, 100].map((x) => (
                  <Box
                    key={x}
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: x + "%",
                      borderLeft: "solid 1px black",
                      height: "10px",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        position: "absolute",
                        bottom: "-20px",
                        transform: "translateX(-50%)",
                      }}
                    >
                      {x}%
                    </Typography>
                  </Box>
                ))}
              </Box>

              {rData && (
                <Box sx={{ height: "300px", marginTop: "2em" }}>
                  <DataGrid
                    rows={rData.rows}
                    columns={rData.cols}
                    density="compact"
                    sortModel={[{ field: "risk", sort: "desc" }]}
                  />
                </Box>
              )}
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
}
