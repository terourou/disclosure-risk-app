import { Box, Container } from "@mui/material";
import { useState } from "react";
import { MenuBar } from "./components/header/MenuBar";
import LoadData from "./components/data/LoadData";
import ViewData from "./components/data/ViewData";
import DisclosureOptions from "./components/DisclosureOptions";
import DisclosureResults from "./components/DisclosureResults";
// import { useRserve } from "@tmelliott/react-rserve";

function App() {
  const [data, setData] = useState(null);
  const [config, setConfig] = useState({ vars: [] });

  // const R = useRserve();
  // const [v, setV] = useState("");

  // useEffect(() => {
  //   if (!R || !R.running) return;
  //   R.ocap((err, funs) => {
  //     funs.rversion((err, value) => setV(value));
  //   });
  // }, [R, setV]);

  return (
    <div className="App">
      <MenuBar />

      <Container maxWidth="lg">
        {/* load data */}
        <Box
          sx={{
            marginTop: "2em",
            height: "360px",
          }}
        >
          {data ? <ViewData data={data} /> : <LoadData setter={setData} />}
        </Box>

        {/* select options */}
        <Box
          sx={{
            marginTop: "2em",
          }}
        >
          <DisclosureOptions data={data} config={config} handler={setConfig} />
        </Box>

        {/* view results */}
        <Box
          sx={{
            marginTop: "2em",
          }}
        >
          <DisclosureResults data={data} config={config} />
        </Box>
      </Container>
    </div>
  );
}

export default App;
