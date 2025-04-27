import { Link, useLocation } from "react-router-dom";
import { Menu, UserPlus, Users } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path ? "bg-indigo-700" : "";
  };

  return (
    <nav className="bg-indigo-600 fixed z-20 min-w-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white text-xl font-bold">
                MySQL And MongoDB
              </span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className={`${isActive(
                    "/"
                  )} text-white px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-indigo-700 transition-colors`}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registrarse
                </Link>
                <Link
                  to="/users"
                  className={`${isActive(
                    "/users"
                  )} text-white px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-indigo-700 transition-colors`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Usuarios
                </Link>
              </div>
            </div>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300 cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>

            {isOpen && (
              <div className="md:hidden absolute z-50 bg-indigo-500 right-13 px-2 pt-2 pb-3 space-y-1 sm:px-3 rounded-md">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={`${isActive(
                    "/"
                  )} text-white flex px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-colors`}
                >
                  <div className="flex items-center">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Registrarse
                  </div>
                </Link>
                <Link
                  to="/users"
                  onClick={() => setIsOpen(false)}
                  className={`${isActive(
                    "/users"
                  )} text-white flex px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-colors`}
                >
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Usuarios
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
