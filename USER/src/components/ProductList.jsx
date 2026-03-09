import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

function ProductList() {
  const navigate = useNavigate();

  const fetchProduct = async () => {
    const res = await fetch(
      "https://store-hub-backend.onrender.com/product/allProducts",
      {
        method: "GET",
        credentials: "include",
      },
    );
    const data = await res.json();
    if (!res.ok)
      throw new Error("Error while fetching product: " + data.message);
    return data;
  };

  const { data: products, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProduct,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-xl">
            <h1 className="text-red-700 font-bold flex items-center gap-2">
              ⚠️ There was an error fetching products
            </h1>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products?.map((product) => {
            return (
              <div
                onClick={() => navigate(`/products/${product._id}`)}
                key={product._id}
                className="group bg-white rounded-4xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.imageUrl}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={product.name}
                  />
                  {/* Stock Badge */}
                  <div
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      product.inStock
                        ? "bg-green-500 text-white"
                        : "bg-gray-800 text-white"
                    }`}
                  >
                    {product.inStock ? "In stock" : "Out of stock"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-auto">
                    {/* ADDED PRODUCT NAME HERE */}
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1 uppercase tracking-tight">
                      {product.productName}
                    </h2>

                    <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing Section */}
                  <div className="mt-6 flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-xs line-through font-medium">
                        ₹{product.originalPrice}
                      </span>
                      <h3 className="text-2xl font-black text-indigo-600">
                        ₹{product.discountPrice}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
