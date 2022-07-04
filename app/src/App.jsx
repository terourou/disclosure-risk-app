import { useState } from "react";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import LoadData from "./components/data/LoadData";
import ViewData from "./components/data/ViewData";

import DisclosureOptions from "./components/DisclosureOptions";
import DisclosureResults from "./components/DisclosureResults";

function App() {
  const [data, setData] = useState(null);
  const [config, setConfig] = useState({ vars: [] });

  return (
    // a side-by-side for development
    <div className="App flex flex-col bg-black gap-1 min-h-screen justify-center">

      <Header />

      <div className="main flex-1 flex flex-col items-stretch gap-10 bg-gradient-to-br from-gray-50 to-green-50 p-4">

        <div className="flex flex-col gap-10 items-center">
          <div className="container h-[360px] drop-shadow">
            {data ? <ViewData data={data} /> : <LoadData setter={setData} />}
          </div>

          {data && (
            <div className="container bg-slate-50 border border-slate-300 rounded-md p-5 drop-shadow">
              <DisclosureOptions data={data} config={config} handler={setConfig} />
            </div>
          )}

          {data && (
            <div className="container flex-1 flex justify-center p-5">
              <DisclosureResults data={data} config={config} />
            </div>
          )}
        </div>

      </div>

      <Footer />

    </div >
  );
}

export default App;
