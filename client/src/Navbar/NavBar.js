import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { IoClose, IoMenu } from "react-icons/io5";
import Amman from "../Amman.png";
import "./Navbar.css";
import { logoffFunc } from "../redux/actions/auth";

function NavBar() {
  const [showMenu, setShowMenu] = React.useState(false);
  const login = useSelector((state) => state.auth.login);
  const dispatch = useDispatch();

  const toggleMenu = () => setShowMenu((s) => !s);

  const closeMenu = () => {
    setShowMenu(false);
  };

  const OnclickLogout = () => {
    dispatch(logoffFunc(false));
    window.location.href = "/";
  };

  const linkBase =
    "block px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150";
  const desktopLink = (isActive) =>
    `${linkBase} ${isActive ? "text-orange-600 bg-orange-50" : "text-gray-700 hover:text-orange-600 hover:bg-orange-50 dark:text-gray-200"}`;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center" aria-label="Home">
              <img src={Amman} alt="Shri Amman Printers" className="h-9 w-auto" />
              <span className="ml-2 text-2xl font-semibold text-orange-500 dark:text-white">
                Shri Amman Printers
              </span>
            </Link>
          </div>

          {/* Center / Desktop Links */}
          <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-4">
            <NavLink to="/form" className={({ isActive }) => desktopLink(isActive)}>
              Order Form
            </NavLink>
            <NavLink to="/status" className={({ isActive }) => desktopLink(isActive)}>
              Order Search
            </NavLink>
            <NavLink to="/update" className={({ isActive }) => desktopLink(isActive)}>
              Order Update
            </NavLink>
          </div>

          {/* Right: Auth / Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex md:items-center">
              {login ? (
                <button
                  onClick={OnclickLogout}
                  className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/"
                  onClick={OnclickLogout}
                  className="inline-flex items-center px-4 py-2 bg-transparent border border-orange-500 text-orange-600 hover:bg-orange-50 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              aria-expanded={showMenu}
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center p-2 rounded-md text-orange-600 hover:bg-orange-50 md:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300"
            >
              {showMenu ? <IoClose className="w-6 h-6" /> : <IoMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Decorative divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden fixed inset-0 z-40 transform ${showMenu ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}
        aria-hidden={!showMenu}
      >
        <div
          className="absolute inset-0 bg-black/30"
          onClick={closeMenu}
          aria-hidden="true"
        />
        <div className="absolute right-0 w-80 max-w-full h-full bg-white dark:bg-gray-900 shadow-xl p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
              <img src={Amman} alt="logo" className="h-8" />
              <span className="text-lg font-semibold text-orange-500">Shri Amman</span>
            </Link>
            <button onClick={closeMenu} className="p-2 rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300">
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-1">
            <NavLink
              to="/form"
              onClick={closeMenu}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-md text-base font-medium ${isActive ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"}`
              }
            >
              Order Form
            </NavLink>
            <NavLink
              to="/status"
              onClick={closeMenu}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-md text-base font-medium ${isActive ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"}`
              }
            >
              Order Search
            </NavLink>
            <NavLink
              to="/update"
              onClick={closeMenu}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-md text-base font-medium ${isActive ? "bg-orange-50 text-orange-600" : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"}`
              }
            >
              Order Update
            </NavLink>
          </nav>

          <div className="mt-6 pt-4 border-t border-orange-100">
            {login ? (
              <button
                onClick={() => {
                  OnclickLogout();
                  closeMenu();
                }}
                className="w-full inline-flex justify-center items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/"
                onClick={() => {
                  OnclickLogout();
                  closeMenu();
                }}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-orange-500 text-orange-600 hover:bg-orange-50 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;