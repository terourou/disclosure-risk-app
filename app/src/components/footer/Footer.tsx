import { useRserve } from "@tmelliott/react-rserve";

const Footer = () => {
  const R = useRserve();

  return (
    <footer className="flex text-white items-center justify-between flex-wrap bg-grey-darkest p-4 bg-gradient-to-br from-gray-700 to-gray-800">
      <div className="flex items-center flex-no-shrink  mr-6">
        <span className="text-sm font-bold pl-2">
          Developed by Te Rourou Tātaritanga
        </span>
      </div>

      <div className="flex items-center flex-no-shrink">
        <span className="text-sm">
          {R && R.running
            ? "Connected to R at " +
                process.env.REACT_APP_R_HOST?.replace(/^wss?:\/\//, "") ||
              "localhost"
            : "Not connected to R"}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
