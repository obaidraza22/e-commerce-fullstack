import { NavLink, useNavigate } from "react-router";
import { ShoppingCart, Package, Home, Store, LogOut, X } from "lucide-react";
import useAuthStore from "../store/authStore";
import useNavModel from "../store/navModelStore";
import { useEffect } from "react";

function Sidebar() {
  const { openModel, closeModel } = useNavModel();
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (openModel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [openModel]);

  const linkStyles = ({ isActive }) =>
    `flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
      isActive
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
        : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
    }`;

  return (
    <>
      {/* 1. DARK TRANSPARENT OVERLAY */}
      <div
        onClick={closeModel}
        className={`fixed inset-0 z-60 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
          openModel ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* 2. SIDEBAR PANEL */}
      <aside
        className={`fixed top-0 right-0 z-70 h-full w-75 bg-white shadow-2xl transition-transform duration-500 ease-in-out transform ${
          openModel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Top Bar: Logo & Close */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Store size={18} />
              </div>
              <span className="text-lg font-black text-gray-900 tracking-tight">
                Store<span className="text-indigo-600">Hub</span>
              </span>
            </div>
            <button
              onClick={closeModel}
              className="p-2 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex flex-col gap-2 grow">
            <NavLink to="/" onClick={closeModel} className={linkStyles}>
              <Home size={20} /> Homepage
            </NavLink>

            <NavLink to="/products" onClick={closeModel} className={linkStyles}>
              <Package size={20} /> Products
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink
                  to="/order"
                  onClick={closeModel}
                  className={linkStyles}
                >
                  <Package size={20} /> My Orders
                </NavLink>
                <NavLink to="/cart" onClick={closeModel} className={linkStyles}>
                  <ShoppingCart size={20} /> Cart
                </NavLink>
              </>
            )}
          </div>

          {/* Bottom Section: Auth */}
          <div className="pt-6 border-t border-gray-100">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  closeModel();
                  navigate("/auth/login");
                }}
                className="flex items-center gap-4 w-full px-6 py-4 text-rose-500 font-bold hover:bg-rose-50 rounded-2xl transition-all"
              >
                <LogOut size={20} /> Logout
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    navigate("/auth/login");
                    closeModel();
                  }}
                  className="w-full py-4 text-gray-600 font-bold rounded-2xl hover:bg-gray-50"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/auth/signup");
                    closeModel();
                  }}
                  className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100"
                >
                  Signup
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
