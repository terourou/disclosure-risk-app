const Header = () => {
  return (
    <nav className="flex text-white items-center justify-between flex-wrap bg-grey-darkest p-4 bg-gradient-to-br from-gray-800 to-gray-700">
      <div className="flex items-center flex-no-shrink  mr-6">
        <span className="text-xl font-bold pl-2">
          Disclosure Risk Calculator
        </span>
      </div>

      <div
        className="w-full flex-grow lg:flex lg:items-center lg:w-auto pt-6 lg:pt-0"
        id="nav-content"
      >
        <ul className="list-reset lg:flex justify-end flex-1 items-center">
          <li className="mr-3">
            <span className="inline-block py-2 px-4 no-underline cursor-pointer">
              About
            </span>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
