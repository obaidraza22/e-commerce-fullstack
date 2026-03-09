import { Route, Routes } from "react-router";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Homepage from "./pages/Homepage";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/Products";
import { Toaster } from "react-hot-toast";
import Product from "./pages/Product";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" index element={<Homepage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
