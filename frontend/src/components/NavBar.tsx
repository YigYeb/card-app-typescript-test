import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  return (
    <nav className="flex justify-between content-around gap-5">
      <div className="flex justify-start pl-4">
        <NavLink className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white" to={"/"}>
          All Entries
        </NavLink>
        <NavLink
          className="m-3 p-4 text-xl bg-blue-400 hover:bg-blue-500 rounded-md font-medium text-white"
          to={"/create"}
        >
          New Entry
        </NavLink>
      </div>
      <div className="content-around pr-4">
        <label className="switch ">
          <input type="checkbox" onChange={toggleTheme} checked={isDarkMode}></input>
          <span className="slider round"></span>
        </label>
        <span className="flex text-sm dark:text-white justify-center mt-1">Mode</span>
      </div>
    </nav>
  );
}
