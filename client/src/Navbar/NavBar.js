import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { 
  Bars3Icon, 
  XMarkIcon, 
  ArrowRightOnRectangleIcon, 
  ArrowLeftOnRectangleIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";
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

  const desktopLink = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-orange-50 text-orange-600 shadow-sm ring-1 ring-orange-200"
        : "text-gray-600 hover:text-orange-600 hover:bg-orange-50/50"
    }`;

  const mobileLink = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
      isActive
        ? "bg-orange-50 text-orange-600 shadow-sm"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 group" aria-label="Home">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-200 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img src={Amman} alt="Shri Amman Printers" className="relative h-9 w-auto transform group-hover:scale-105 transition-transform duration-200" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-500 hidden sm:block">
                Shri Amman Printers
              </span>
            </Link>
          </div>

          {/* Center / Desktop Links */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <NavLink to="/form" className={desktopLink}>
              <ClipboardDocumentListIcon className="w-4 h-4" />
              <span>New Order</span>
            </NavLink>
            <NavLink to="/status" className={desktopLink}>
              <MagnifyingGlassIcon className="w-4 h-4" />
              <span>Search</span>
            </NavLink>
            <NavLink to="/update" className={desktopLink}>
              <PencilSquareIcon className="w-4 h-4" />
              <span>Update</span>
            </NavLink>
          </div>

          {/* Right: Auth / Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex md:items-center">
              {login ? (
                <button
                  onClick={OnclickLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium rounded-xl transition-colors border border-gray-200"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/"
                  onClick={OnclickLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5"
                >
                  <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              aria-expanded={showMenu}
              aria-label="Toggle menu"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-orange-600 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-colors"
            >
              {showMenu ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          showMenu ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
          onClick={closeMenu}
          aria-hidden="true"
        />
        
        {/* Panel */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-out ${
            showMenu ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
              <span className="text-lg font-bold text-gray-900 dark:text-white">Menu</span>
              <button
                onClick={closeMenu}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              <NavLink to="/form" onClick={closeMenu} className={mobileLink}>
                <ClipboardDocumentListIcon className="w-5 h-5" />
                New Order
              </NavLink>
              <NavLink to="/status" onClick={closeMenu} className={mobileLink}>
                <MagnifyingGlassIcon className="w-5 h-5" />
                Order Search
              </NavLink>
              <NavLink to="/update" onClick={closeMenu} className={mobileLink}>
                <PencilSquareIcon className="w-5 h-5" />
                Order Update
              </NavLink>
            </nav>

            <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
              {login ? (
                <button
                  onClick={() => {
                    OnclickLogout();
                    closeMenu();
                  }}
                  className="w-full inline-flex justify-center items-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/"
                  onClick={() => {
                    OnclickLogout();
                    closeMenu();
                  }}
                  className="w-full inline-flex justify-center items-center gap-2 px-4 py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/20"
                >
                  <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;