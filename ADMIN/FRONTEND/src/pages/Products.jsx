import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import { useQuery } from "@tanstack/react-query";

function Products() {
  const navigate = useNavigate();
  const fetchProducts = async () => {
    const res = await fetch(
      "https://store-hub-backend.onrender.com/product/allProducts",
      {
        method: "GET",
        credentials: "include",
      },
    );
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Products</h1>
          <p className="text-gray-500">
            Manage and view your current inventory
          </p>
        </header>

        {isPending && (
          <div className="animate-pulse text-blue-600 font-medium">
            Loading catalog...
          </div>
        )}
        {isError && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md">
            {error.message}
          </div>
        )}

        {/* Empty State - Restricted to your original style */}
        {!isPending && !isError && (!data || data.length === 0) && (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 mb-4 font-bold text-lg">
              There are no products try adding some
            </p>
            <button
              onClick={() => navigate("/products/create-products")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
            >
              Add Product
            </button>
          </div>
        )}

        <div className="grid w-full grid-cols-1 gap-6">
          {data?.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row items-center p-2"
            >
              {/* Product Image */}
              <div className="w-full md:w-64 h-48 md:h-52 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  src={product.imageUrl}
                  alt={product.productName}
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 capitalize mb-1">
                      {product.productName}
                    </h2>
                    <p className="text-gray-500 text-sm line-clamp-2 max-w-md">
                      {product.description}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.inStock
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-black text-gray-900">
                      ₹{product.discountPrice}
                    </span>
                    <span className="text-sm text-gray-400 line-through font-medium">
                      ₹{product.originalPrice}
                    </span>
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded">
                      {Math.round(
                        ((product.originalPrice - product.discountPrice) /
                          product.originalPrice) *
                          100,
                      )}
                      % OFF
                    </span>
                  </div>

                  <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
                    onClick={() =>
                      navigate(`/products/update-products/${product._id}`)
                    }
                  >
                    Update Product
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Products;
