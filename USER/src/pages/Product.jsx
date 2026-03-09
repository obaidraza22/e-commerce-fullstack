import { useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";

function Product() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const { id: productId } = useParams();

  const addToCart = async (data) => {
    const res = await fetch(
      "https://store-hub-backend.onrender.com/cart/add-to-cart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );
    const d = await res.json();
    if (!res.ok) throw new Error(d.message);
    return d;
  };

  const { mutate: addToCartMutate, isPending } = useMutation({
    mutationFn: addToCart,
    onMutate: () => {
      const toastId = toast.loading("Adding to cart...");
      return { toastId };
    },
    onSuccess: (data, variables, context) => {
      toast.success("Added to cart", { id: context.toastId });
    },
    onError: (error, variables, context) => {
      toast.error("Error: " + error.message, { id: context.toastId });
    },
  });

  const fetchProduct = async (productId) => {
    const res = await fetch(
      `https://store-hub-backend.onrender.com/product/${productId}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    const data = await res.json();
    return data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <h1 className="text-gray-500 font-medium animate-pulse">
            Loading product details...
          </h1>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md border border-red-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-500">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Breadcrumb / Back Link */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-8 font-medium group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image Section */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-gray-200/50">
              <img
                src={data?.imageUrl}
                alt={data?.productName}
                className="w-full h-auto object-cover aspect-square hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-widest rounded-full">
                Premium Collection
              </span>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">
                {data?.productName}
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed max-w-xl">
                {data?.description}
              </p>
            </div>

            {/* Pricing Section */}
            <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-4xl border border-gray-100 w-fit">
              <div className="flex flex-col">
                <span className="text-gray-400 text-sm line-through font-bold decoration-2 decoration-rose-400/50">
                  ₹{data?.originalPrice}
                </span>
                <span className="text-4xl font-black text-indigo-600 tracking-tighter">
                  ₹{data?.discountPrice}
                </span>
              </div>
              <div className="h-10 w-px bg-gray-200"></div>
              <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                SAVE{" "}
                {Math.round(
                  ((data?.originalPrice - data?.discountPrice) /
                    data?.originalPrice) *
                    100,
                )}
                %
              </div>
            </div>

            {/* Features Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl">
                <Truck className="text-indigo-600" size={24} />
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Free Delivery
                  </p>
                  <p className="text-xs text-gray-500">Orders over ₹999</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl">
                <ShieldCheck className="text-indigo-600" size={24} />
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    2 Year Warranty
                  </p>
                  <p className="text-xs text-gray-500">Authentic Product</p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                if (isAuthenticated) addToCartMutate({ productId: data?._id });
                else {
                  toast.error("Please Login first");
                  navigate("/auth/login");
                }
              }}
              className="flex items-center justify-center gap-4 w-full bg-gray-900 hover:bg-indigo-600 text-white font-black py-6 rounded-4xl shadow-xl shadow-gray-200 transition-all active:scale-[0.98] group"
            >
              <ShoppingCart
                size={24}
                className="group-hover:-translate-y-1 transition-transform"
              />
              {isPending ? (
                <div className="w-4 h-4 border-2 rounded-full border-t-transparent animate-spin"></div>
              ) : (
                <span className="text-lg">Add to Shopping Bag</span>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Product;
