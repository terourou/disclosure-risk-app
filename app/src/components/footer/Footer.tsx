import { useRserve } from "@tmelliott/react-rserve";
import { AnimateSharedLayout, motion } from "framer-motion";

import Rlogo from "./Rlogo.svg";

const Footer = () => {
  const { R, connecting } = useRserve();

  return (
    <footer className="flex text-white items-center justify-between flex-wrap bg-grey-darkest p-4 bg-gradient-to-br from-gray-700 to-gray-800">
      <div className="flex items-center flex-no-shrink  mr-6">
        <span className="text-sm font-bold pl-2">
          Developed by Te Rourou Tātaritanga
        </span>
      </div>

      <AnimateSharedLayout>
        <div className="flex items-center flex-no-shrink">
          <span className="text-xs">
            {R && R.running ? (
              <div className="flex items-center gap-2">
                <motion.img
                  src={Rlogo}
                  className="h-8"
                  layoutId="r-logo"
                  transition={{ duration: 1 }}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex flex-col items-center justify-center"
                >
                  <span className="text-slate-300">Connected to</span>
                  {process.env.REACT_APP_R_HOST?.replace(/^wss?:\/\//, "") ||
                    "localhost"}
                </motion.div>
              </div>
            ) : connecting ? (
              <div className="flex items-center gap-2">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Connecting &hellip;
                </motion.span>
                <motion.img
                  src={Rlogo}
                  className="h-8 animate-pulse"
                  layoutId="r-logo"
                  transition={{ duration: 1 }}
                />
              </div>
            ) : (
              "Not connected to R"
            )}
          </span>
        </div>
      </AnimateSharedLayout>
    </footer>
  );
};

export default Footer;
