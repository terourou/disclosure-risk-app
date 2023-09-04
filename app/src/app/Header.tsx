import Link from "next/link";

import Logo from "../../public/logo.png";
import Image from "next/image";

const Header = () => {
  return (
    <nav className="bg-grey-darkest flex flex-wrap items-center justify-between bg-gradient-to-br from-gray-800 to-gray-700 p-4 text-white">
      <div className="flex-no-shrink mr-6 flex  items-center">
        <Link href="/">
          <div className="flex items-center gap-4 pl-2 text-xl font-bold">
            <div className="h-14 rounded-full bg-white p-3">
              <Image src={Logo} className="h-full w-auto" alt="Logo" />
            </div>
            <div className="flex flex-col">
              <span>Disclosure Risk</span>
              <span className="">Calculator</span>
            </div>
          </div>
        </Link>
      </div>

      <div
        className="w-full flex-grow pt-6 lg:flex lg:w-auto lg:items-center lg:pt-0"
        id="nav-content"
      >
        <ul className="list-reset flex-1 items-center justify-end lg:flex">
          <li className="mr-3">
            <Link href="/">
              <span className="inline-block cursor-pointer px-4 py-2 no-underline">
                Home
              </span>
            </Link>
            <Link href="/about">
              <span className="inline-block cursor-pointer px-4 py-2 no-underline">
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
