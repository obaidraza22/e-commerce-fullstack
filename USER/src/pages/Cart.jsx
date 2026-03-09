import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

function Cart() {
  const queryClient = useQueryClient();
  const getCart = async () => {
    const res = await fetch(
      "https://store-hub-backend.onrender.com/cart/my-cart",
      {
        credentials: "include",
        method: "GET",
      },
    );
    const data = await res.json();
    return data;
  };

  const increaseQuantity = async (data) => {
    const res = await fetch(
      "https://store-hub-backend.onrender.com/cart/increaseQuantity/",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: data }),
      },
    );
    const d = await res.json();
    return d;
  };

  const decreaseQuantity = async (data) => {
    const res = await fetch(
      "https://store-hub-backend.onrender.com/cart/decreaseQuantity",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: data }),
      },
    );
    const d = await res.json();
    return d;
  };

  const deleteProduct = async (data) => {
    const res = await fetch(
      "https://store-hub-backend.onrender.com/cart/delete-product",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: data }),
      },
    );
    const d = await res.json();
    return d;
  };

  const placeOrder = async (data) => {
    const res = await fetch(
      "https://store-hub-backend.onrender.com/order/createOrder",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartId: data }),
      },
    );
    const d = await res.json();
    return d;
  };

  const { mutate: increaseQuantityMutation } = useMutation({
    mutationFn: increaseQuantity,
    onSuccess: () => {
      toast.success("Quantity increased");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const { mutate: decreaseQuantityMutation } = useMutation({
    mutationFn: decreaseQuantity,
    onSuccess: () => {
      toast.success("Quantity decreased");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const { mutate: deleteProductMutate } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("Product removed from cart");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const { mutate: placeOrderMutate } = useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      toast.success("Order placed successfully");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="grow flex flex-col items-center justify-center gap-6">
          {/* Animated Spinner */}
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <ShoppingBag
              className="absolute text-indigo-600 animate-pulse"
              size={20}
            />
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900">
              Preparing your bag
            </h2>
            <p className="text-gray-400 text-sm">
              Checking for latest prices and stock...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  if (isError)
    return (
      <div className="h-screen flex items-center justify-center">
        Error fetching cart
      </div>
    );

  // Calculate the total price based on (price * quantity)
  const totalAmount =
    data?.products?.reduce((acc, item) => {
      return acc + item.productId?.discountPrice * item.quantity;
    }, 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="grow max-w-5xl mx-auto w-full p-6 md:p-12">
        <h1 className="text-3xl font-black mb-8">Shopping Cart</h1>

        {data?.products?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* List of Items */}
            <div className="lg:col-span-2 space-y-4">
              {data.products.map((item) => (
                <div
                  key={item._id}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex gap-6 items-center"
                >
                  <img
                    src={item.productId?.imageUrl}
                    alt={item.productId?.productName}
                    className="w-24 h-24 object-cover rounded-2xl bg-gray-50"
                  />

                  <div className="grow">
                    <h3 className="font-bold text-lg">
                      {item.productId?.productName}
                    </h3>
                    <p className="text-indigo-600 font-bold">
                      ₹{item.productId?.discountPrice}
                    </p>

                    {/* Quantity Control UI */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() =>
                          decreaseQuantityMutation(item.productId._id)
                        }
                        className="p-1 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          increaseQuantityMutation(item.productId._id)
                        }
                        className="p-1 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-4">
                    <p className="font-black text-gray-900">
                      ₹{item.productId?.discountPrice * item.quantity}
                    </p>
                    <button
                      onClick={() => deleteProductMutate(item.productId._id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-3 pb-6 border-b border-gray-100">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span className="text-green-600 font-bold text-xs uppercase">
                      Free
                    </span>
                  </div>
                </div>
                <div className="flex justify-between py-6">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-black text-indigo-600">
                    ₹{totalAmount}
                  </span>
                </div>
                <button
                  onClick={() => placeOrderMutate(data._id)}
                  className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-indigo-600 transition-all"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-20 rounded-3xl border border-dashed border-gray-200 text-center">
            <p className="text-gray-400">Your cart is empty</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Cart;
