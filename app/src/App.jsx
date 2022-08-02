import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import About from "./About";

import LoadData from "./components/data/LoadData";
import ViewData from "./components/data/ViewData";

import DisclosureOptions from "./components/DisclosureOptions";
import DisclosureResults from "./components/DisclosureResults";
import { AnimatePresence, motion } from "framer-motion";


function App() {
  const [data, setData] = useState(null);
  const [config, setConfig] = useState({ vars: [] });

  const location = useLocation();

  return (
    // a side-by-side for development
    <div className="App flex flex-col bg-black gap-1 min-h-screen justify-center">

      <AnimatePresence>
        <Header />

        <div className="main flex-1 flex flex-col items-stretch gap-10 bg-gradient-to-br from-gray-50 to-green-50 p-4">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Main data={data} setData={setData} config={config} setConfig={setConfig} />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </AnimatePresence>

      <Footer />

    </div >
  );
}

const mainVariants = {
  in: {
    opacity: 0,
    y: -20
  },
  visible: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: 20
  }
}

function Main({ data, setData, config, setConfig }) {
  return (
    <motion.div
      variants={mainVariants}
      initial="in"
      animate="visible"
      exit="out"
      className="flex flex-col gap-10 items-center 2xl:flex-row 2xl:items-start 2xl:justify-center">
      <div className="w-full 2xl:max-w-[40vw] flex flex-col gap-10 items-center">
        <div className="container h-[360px] drop-shadow">
          {data ? <ViewData data={data} clear={() => setData(null)} /> : <LoadData setter={setData} />}
        </div>

        {data && (
          <motion.div initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1.2 }}
            className="container bg-slate-50 border border-slate-300 rounded-md p-5 drop-shadow">
            <DisclosureOptions data={data} config={config} handler={setConfig} />
          </motion.div>
        )}
      </div>

      {data && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 1 }}
          className="container flex-1 flex justify-center p-5">
          <DisclosureResults data={data} config={config} />
        </motion.div>
      )}
    </motion.div>
  )
}

export default App;
