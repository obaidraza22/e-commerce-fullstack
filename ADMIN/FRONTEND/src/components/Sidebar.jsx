// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion"; // Changed to framer-motion standard import
import { NavLink, useNavigate } from "react-router";
import { FaHome, FaAngleDown, FaAngleUp, FaUser } from "react-icons/fa";
import {
  FaCartShopping,
  FaPlus,
  FaBoxOpen,
  FaLayerGroup,
} from "react-icons/fa6";
import { MdProductionQuantityLimits, MdLogout } from "react-icons/md";
import useModelStore from "../store/modelStore";
import useAuthStore from "../store/useAuthStore";

function Sidebar() {
  const navigate = useNavigate();
  const { isModelOpen, toggleModel } = useModelStore((state) => state);
  const { isAuthenticated, logout } = useAuthStore((state) => state);

  // Reusable active link style
  const activeLinkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold ${
      isActive
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
        : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-600"
    }`;

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col shrink-0 sticky top-0"
    >
      {/* Brand Logo */}
      <div className="p-8 mb-4">
        <div className="flex items-center gap-3 text-indigo-600">
          <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-md">
            <FaCartShopping size={20} />
          </div>
          <span className="text-xl font-black tracking-tight text-gray-800 font-poppins">
            STORE<span className="text-indigo-600">HUB</span>
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {isAuthenticated ? (
          <>
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
              Main Menu
            </p>

            {/*<NavLink to="/" end className={activeLinkClass}>
              <FaHome size={18} />
              <span>Dashboard</span>
            </NavLink> */}

            {/* Collapsible Products Menu */}
            <div>
              <button
                onClick={toggleModel}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold ${
                  isModelOpen
                    ? "text-indigo-600 bg-indigo-50/50"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FaLayerGroup size={18} />
                  <span>Inventory</span>
                </div>
                {isModelOpen ? (
                  <FaAngleUp size={14} />
                ) : (
                  <FaAngleDown size={14} />
                )}
              </button>

              <AnimatePresence>
                {isModelOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pl-10 pr-2 mt-1 space-y-1"
                  >
                    <NavLink
                      to="/products/create-products"
                      className={({ isActive }) =>
                        `flex items-center gap-2 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "text-indigo-600"
                            : "text-gray-400 hover:text-indigo-500"
                        }`
                      }
                    >
                      <FaPlus size={10} /> Add Product
                    </NavLink>
                    <NavLink
                      to="/products"
                      end
                      className={({ isActive }) =>
                        `flex items-center gap-2 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "text-indigo-600"
                            : "text-gray-400 hover:text-indigo-500"
                        }`
                      }
                    >
                      <FaBoxOpen size={10} /> Product List
                    </NavLink>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavLink to="/orders" className={activeLinkClass}>
              <MdProductionQuantityLimits size={18} />
              <span>Orders</span>
            </NavLink>
          </>
        ) : (
          <div className="p-4 text-center">
            <p className="text-xs text-gray-400 mb-4 font-medium">
              Please sign in to manage your store.
            </p>
          </div>
        )}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-50 bg-gray-50/50">
        {!isAuthenticated ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/auth/login")}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-100"
          >
            <FaUser size={14} />
            <span>Login</span>
          </motion.button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                AD
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-700">
                  Admin User
                </span>
                <span className="text-[10px] text-gray-400 uppercase">
                  Premium Plan
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all font-bold text-sm"
            >
              <MdLogout size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}

export default Sidebar;
