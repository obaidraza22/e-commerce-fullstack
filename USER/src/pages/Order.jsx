import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, ReceiptText, AlertCircle, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

function Order() {
  const navigate = useNavigate();

  const fetchOrder = async () => {
    const res = await fetch(
      "https://store-hub-backend.onrender.com/order/getSingleOrder",
      {
        method: "GET",
        credentials: "include",
      },
    );
    if (!res.ok) throw new Error("Order not found");
    return res.json();
  };

  const {
    data: order,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["order"],
    queryFn: fetchOrder,
  });

  // --- STYLED LOADING STATE ---
  if (isPending)
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="grow max-w-5xl mx-auto w-full px-6 py-16 animate-pulse">
          <div className="flex flex-col items-center mb-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full mb-6"></div>
            <div className="h-8 w-48 bg-gray-100 rounded-lg mb-3"></div>
            <div className="h-4 w-32 bg-gray-50 rounded-lg"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-6 w-32 bg-gray-100 rounded"></div>
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-3xl"></div>
                  <div className="grow space-y-3 py-2">
                    <div className="h-5 w-2/3 bg-gray-100 rounded"></div>
                    <div className="h-4 w-1/4 bg-gray-50 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 h-64 rounded-[2.5rem]"></div>
          </div>
        </main>
        <Footer />
      </div>
    );

  // --- STYLED ERROR / EMPTY STATE ---
  if (isError || !order)
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <main className="grow flex flex-col items-center justify-center p-6">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-red-100 blur-2xl rounded-full opacity-50"></div>
            <div className="relative w-20 h-20 bg-white border border-red-50 flex items-center justify-center rounded-3xl shadow-sm text-red-500">
              <AlertCircle size={40} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-3">
            Something's Missing
          </h2>
          <p className="text-gray-500 text-center max-w-sm mb-10 leading-relaxed">
            We couldn't find an active order for this account. If you just
            purchased something, it might take a moment to appear.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200"
          >
            <ArrowLeft size={18} />
            Back to Shopping
          </button>
        </main>
        <Footer />
      </div>
    );

  // --- MAIN CONTENT ---
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="grow max-w-5xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full mb-6">
            <ReceiptText size={32} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-3">
            Order Confirmed
          </h1>
          <p className="text-gray-500">
            Order ID:{" "}
            <span className="font-mono font-bold text-indigo-600">
              #{order._id?.slice(-8).toUpperCase()}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-900">Your Items</h3>
            </div>
            <div className="space-y-6">
              {order.products?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-6 group">
                  <div className="w-24 h-24 bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shrink-0 shadow-sm transition-transform group-hover:scale-105">
                    <img
                      src={item.productId?.imageUrl}
                      className="w-full h-full object-cover"
                      alt={item.productId?.productName}
                    />
                  </div>
                  <div className="grow">
                    <h4 className="font-bold text-gray-900 text-lg">
                      {item.productId?.productName}
                    </h4>
                    <p className="text-sm text-gray-400">
                      Quantity:{" "}
                      <span className="text-gray-900 font-medium">
                        {item.quantity}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900 text-lg">
                      ₹{item.productId?.discountPrice * item.quantity}
                    </p>
                    <p className="text-xs text-gray-400">
                      ₹{item.productId?.discountPrice} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-8 rounded-[2.5rem] sticky top-24 border border-gray-100/50">
              <h3 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">
                Payment Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{order.totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Cost</span>
                  <span className="text-green-600 font-bold uppercase text-xs mt-1">
                    Free
                  </span>
                </div>
                <div className="pt-6 mt-6 border-t border-gray-200 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-black tracking-widest">
                      Total Paid
                    </p>
                    <p className="text-3xl font-black text-gray-900">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-[10px] font-black uppercase mb-1">
                    Success
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate("/products")}
                className="w-full mt-10 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Order;
