import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import About from "./About";

import LoadData from "./components/data/LoadData";
import ViewData from "./components/data/ViewData";

import DisclosureOptions from "./components/DisclosureOptions";
import DisclosureResults from "./components/DisclosureResults";
import { AnimatePresence, motion } from "framer-motion";
import { Data } from "./types/data";
import { Config } from "./components/DisclosureOptions";

declare global {
  // Matomo window object type
  interface Window {
    _mtm: {
      "mtm.startTime": number;
      event: string;
    }[];
  }
}

function App() {
  const [data, setData] = useState<Data | null>(null);
  const [config, setConfig] = useState({ vars: [] as string[] });

  const location = useLocation();

  useEffect(() => {
    var _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
    (function () {
      var d = document,
        g = d.createElement("script"),
        s = d.getElementsByTagName("script")[0];
      g.async = true;
      g.src =
        "https://ec2-3-104-45-196.ap-southeast-2.compute.amazonaws.com/js/container_YbYkzbgl.js";
      s.parentNode?.insertBefore(g, s);
    })();
  }, []);

  return (
    // a side-by-side for development
    <div className="App flex flex-col bg-black gap-1 min-h-screen justify-center">
      <AnimatePresence>
        <Header key={"header"} />

        <div className="main flex-1 flex flex-col items-stretch gap-10 bg-gradient-to-br from-gray-50 to-green-50 p-4">
          <Routes location={location} key={"path-" + location.pathname}>
            <Route
              path="/"
              element={
                <Main
                  data={data}
                  setData={setData}
                  config={config}
                  setConfig={setConfig}
                />
              }
            />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </AnimatePresence>

      <Footer key="footer" />
    </div>
  );
}

const mainVariants = {
  in: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: 20,
  },
};

function Main({
  data,
  setData,
  config,
  setConfig,
}: {
  data: Data | null;
  setData: React.Dispatch<React.SetStateAction<Data | null>>;
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
}) {
  console.log(data);
  return (
    <motion.div
      variants={mainVariants}
      initial="in"
      animate="visible"
      exit="out"
      className="flex flex-col gap-10 items-center 2xl:flex-row 2xl:items-start 2xl:justify-center"
    >
      <div className="w-full 2xl:max-w-[40vw] flex flex-col gap-10 items-center">
        <div className="container h-[420px] drop-shadow">
          {data ? (
            <ViewData data={data} clear={() => setData(null)} />
          ) : (
            <LoadData setter={setData} />
          )}
        </div>

        {data && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1.2 }}
            className="container bg-slate-50 border border-slate-300 rounded-md p-5 drop-shadow"
          >
            <DisclosureOptions
              data={data}
              config={config}
              handler={setConfig}
            />
          </motion.div>
        )}
      </div>

      {data && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 1 }}
          className="container flex-1 flex justify-center p-5"
        >
          <DisclosureResults data={data} config={config} />
        </motion.div>
      )}
    </motion.div>
  );
}

export default App;
