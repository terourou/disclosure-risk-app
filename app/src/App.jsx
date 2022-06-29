import { useState } from "react";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import LoadData from "./components/data/LoadData";
import ViewData from "./components/data/ViewData";

import DisclosureOptions from "./components/DisclosureOptions";
import DisclosureResults from "./components/DisclosureResults";

// --- modules to remove
import { MenuBar } from "./components/header/MenuBar";
import { Box, Container } from "@mui/material";
import ViewDataOld from "./components/data/ViewDataOld";
import LoadDataOld from "./components/data/LoadDataOld";
import DisclosureOptionsOld from "./components/DisclosureOptionsOld";
import DisclosureResultsOld from "./components/DisclosureResultsOld";
// ---


function App() {
  const [data, setData] = useState(null);
  const [config, setConfig] = useState({ vars: [] });

  return (
    // a side-by-side for development
    <div className="App flex bg-black gap-1 min-h-screen">
      <div className="flex-1 bg-white flex flex-col"> {/* remove this div once finished */}

        <Header />

        <div className="main flex-1 flex flex-col gap-10 bg-gradient-to-br from-gray-50 to-green-50 p-4">

          <div className="container h-[360px] drop-shadow">
            {data ? <ViewData data={data} /> : <LoadData setter={setData} />}
          </div>

          {data && (
            <div className="container bg-slate-50 border border-slate-300 rounded-md p-5 drop-shadow">
              <DisclosureOptions data={data} config={config} handler={setConfig} />
            </div>
          )}

          {data && (
            <div className="container flex-1 flex items-center justify-center p-5 drop-shadow">
              <DisclosureResults data={data} config={config} />
            </div>
          )}

        </div>

        <Footer />

      </div>

      <div className="flex-1 bg-white">
        <MenuBar />

        <Container maxWidth="lg">
          {/* load data */}
          <Box
            sx={{
              marginTop: "2em",
              height: "360px",
            }}
          >
            {data ? <ViewDataOld data={data} /> : <LoadDataOld setter={setData} />}
          </Box>

          {/* select options */}
          <Box
            sx={{
              marginTop: "2em",
            }}
          >
            <DisclosureOptionsOld data={data} config={config} handler={setConfig} />
          </Box>

          {/* view results */}
          <Box
            sx={{
              marginTop: "2em",
            }}
          >
            <DisclosureResultsOld data={data} config={config} />
          </Box>
        </Container>
      </div>
    </div>
  );
}

export default App;
