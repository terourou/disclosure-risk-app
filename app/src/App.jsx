import { useState } from "react";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import LoadData from "./components/data/LoadData";
import ViewData from "./components/data/ViewData";

import DisclosureOptions from "./components/DisclosureOptions";
import DisclosureResults from "./components/DisclosureResults";
import { AnimatePresence, motion } from "framer-motion";

function App() {
  const [data, setData] = useState(null);
  const [config, setConfig] = useState({ vars: [] });

  return (
    // a side-by-side for development
    <div className="App flex flex-col bg-black gap-1 min-h-screen justify-center">

      <Header />

      <AnimatePresence>
        <div className="main flex-1 flex flex-col items-stretch gap-10 bg-gradient-to-br from-gray-50 to-green-50 p-4">

          <div className="flex flex-col gap-10 items-center 2xl:flex-row 2xl:items-start 2xl:justify-center">
            <div className="w-full 2xl:max-w-[40vw] flex flex-col gap-10 items-center">
              <div className="container h-[360px] drop-shadow">
                {data ? <ViewData data={data} /> : <LoadData setter={setData} />}
              </div>

              {data && (
                <motion.div initial={{ opacity: 0, transform: 'translateY(-20%)' }}
                  animate={{ opacity: 1, transform: 'translateY(0%)' }}
                  className="container bg-slate-50 border border-slate-300 rounded-md p-5 drop-shadow">
                  <DisclosureOptions data={data} config={config} handler={setConfig} />
                </motion.div>
              )}
            </div>

            {data && (
              <motion.div
                initial={{ opacity: 0, transform: 'scaleX(0)' }}
                animate={{ opacity: 1, transform: 'scaleX(1)' }}
                className="container flex-1 flex justify-center p-5">
                <DisclosureResults data={data} config={config} />
              </motion.div>
            )}
          </div>

        </div>
      </AnimatePresence>

      <Footer />

    </div >
  );
}

export default App;
