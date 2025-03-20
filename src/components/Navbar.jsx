import { Link, useLocation } from 'react-router-dom';
import { UserPlus, Users } from 'lucide-react';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-indigo-700' : '';
  };

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white text-xl font-bold">MySQL And MongoDB</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className={`${isActive('/')} text-white px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-indigo-700 transition-colors`}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registrarse
                </Link>
                <Link
                  to="/users"
                  className={`${isActive('/users')} text-white px-3 py-2 rounded-md text-sm font-medium flex items-center hover:bg-indigo-700 transition-colors`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Usuarios
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;