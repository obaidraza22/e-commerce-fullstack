import { NavLink, useNavigate } from "react-router";
import { ShoppingCart, Package, Home, Store, LogOut } from "lucide-react";
import useAuthStore from "../store/authStore";
import useNavModel from "../store/navModelStore";
import Sidebar from "./Sidebar";

function Navbar() {
  const { openModel, toggleModel } = useNavModel((state) => state);
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);

  const linkStyles = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
      isActive
        ? "bg-indigo-50 text-indigo-600 shadow-sm"
        : "text-gray-600 hover:bg-gray-50 hover:text-indigo-500"
    }`;

  return (
    <>
      {openModel && <Sidebar />}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
              <Store size={24} />
            </div>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              Store<span className="text-indigo-600">Hub</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={linkStyles}>
              <Home size={18} />
              Homepage
            </NavLink>

            <NavLink to="/products" className={linkStyles}>
              <Package size={18} />
              Products
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/order" className={linkStyles}>
                  Order
                </NavLink>

                <div className="w-px h-6 bg-gray-200 mx-2" />

                <NavLink to="/cart" className="relative group mr-2">
                  {({ isActive }) => (
                    <div
                      className={`p-3 rounded-full transition-all ${
                        isActive
                          ? "bg-indigo-600 text-white shadow-indigo-200 shadow-lg"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <ShoppingCart size={20} />
                      {/*<span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      3
                    </span>*/}
                    </div>
                  )}
                </NavLink>
              </>
            )}

            {/* Auth Buttons Styling */}
            <div className="flex items-center gap-2 ml-2">
              {isAuthenticated ? (
                <button
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 font-semibold hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                  onClick={() => {
                    logout();
                    navigate("/auth/login");
                  }}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              ) : (
                <>
                  <NavLink
                    to="/auth/login"
                    className="px-4 py-2 text-gray-600 font-semibold hover:text-indigo-600 transition-colors"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/auth/signup"
                    className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                  >
                    Signup
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Placeholder */}
          <div className="md:hidden" onClick={() => toggleModel()}>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
