import { Routes, Route } from "react-router";
// import Homepage from "./pages/Homepage";
import CreateProducts from "./pages/CreateProducts";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateProducts from "./pages/UpdateProducts";
import Products from "./pages/Products";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route element={<ProtectedRoute />}>
          {/*<Route path="/" element={<Homepage />} />*/}
          <Route
            path="/products/create-products"
            element={<CreateProducts />}
          />
          <Route
            path="/products/update-products/:id"
            element={<UpdateProducts />}
          />
          <Route path="/products" index element={<Products />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
        <Route path="/auth/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
