import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className="flex text-white items-center justify-between flex-wrap bg-grey-darkest p-4 bg-gradient-to-br from-gray-800 to-gray-700">
      <div className="flex items-center flex-no-shrink  mr-6">
        <Link to="/">
          <div className="text-xl font-bold pl-2 flex items-center gap-4">
            <div className="h-14 p-3 bg-white rounded-full">
              <img src="/logo.png" className="h-full" alt="Logo" />
            </div>
            <div className="flex flex-col">
              <span>Disclosure Risk</span>
              <span className="">Calculator</span>
            </div>
          </div>
        </Link>
      </div>

      <div
        className="w-full flex-grow lg:flex lg:items-center lg:w-auto pt-6 lg:pt-0"
        id="nav-content"
      >
        <ul className="list-reset lg:flex justify-end flex-1 items-center">
          <li className="mr-3">
            <Link to="/">
              <span className="inline-block py-2 px-4 no-underline cursor-pointer">
                Home
              </span>
            </Link>
            <Link to="/about">
              <span className="inline-block py-2 px-4 no-underline cursor-pointer">
                About
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
