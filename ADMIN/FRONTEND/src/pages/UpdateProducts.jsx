import { useForm } from "react-hook-form";
import Sidebar from "../components/Sidebar";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Save } from "lucide-react"; // Optional: Icons make it look very modern
import toast from "react-hot-toast";
import Model from "../components/Model";
import { useState } from "react";

function UpdateProducts() {
  const [openModel, setOpenModel] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();
  const { id } = useParams();

  const fetchProduct = async () => {
    const res = await fetch(
      `https://store-hub-backend.onrender.com/product/${id}`,
      {
        credentials: "include",
      },
    );
    const data = await res.json();
    return data;
  };

  const UpdateProduct = async (data) => {
    const res = await fetch(
      `https://store-hub-backend.onrender.com/product/update-product/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );
    return await res.json();
  };

  const deleteProduct = async (id) => {
    const res = await fetch(
      `https://store-hub-backend.onrender.com/product/delete-product/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    const data = await res.json();
    return data;
  };

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteProduct,
    onMutate: () => {
      const toastId = toast.loading("Deleting product...");
      return { toastId };
    },
    onSuccess: (data, variables, context) => {
      navigate("/products");
      toast.success("Product deleted successfully", { id: context.toastId });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
    onError: (error, variables, context) => {
      toast.error("Error occured: " + error.message, { id: context.toastId });
    },
  });

  const handleDelete = () => {
    setOpenModel(true);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: fetchProduct,
  });

  const { mutate: updateMutate } = useMutation({
    mutationFn: UpdateProduct,
    onMutate: () => {
      const toastId = toast.loading("Updating product...");
      return { toastId };
    },
    onSuccess: (data, variables, context) => {
      toast.success("Product updated successfully", { id: context.toastId });
      navigate("/products");
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
    onError: (error, variables, context) => {
      toast.error("Failed to update: " + error.message, {
        id: context.toastId,
      });
    },
  });

  const onSubmit = (data) => updateMutate(data);
  console.log(data);

  return (
    <>
      {openModel && (
        <Model
          openModel={openModel}
          setOpenModel={setOpenModel}
          setConfirmDelete={setConfirmDelete}
          deleteMutate={deleteMutate}
          id={id}
        />
      )}
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex grow justify-center items-start py-12 px-4">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <h1 className="text-gray-600 font-medium">Loading details...</h1>
            </div>
          ) : (
            <div className="w-full max-w-2xl bg-white shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden border border-gray-100">
              {/* Form Header */}
              <div className="bg-linear-to-r from-indigo-600 to-violet-600 p-8 text-white">
                <h2 className="text-2xl font-bold">Edit Product</h2>
                <p className="text-indigo-100 text-sm mt-1">
                  Update the inventory details and pricing.
                </p>
              </div>

              <form className="p-8 space-y-8" onSubmit={handleSubmit(onSubmit)}>
                {/* Product Name */}
                <div className="relative group">
                  <input
                    defaultValue={data.productName}
                    type="text"
                    id="productName"
                    placeholder=" "
                    className="w-full border-b-2 border-gray-200 outline-none pt-6 pb-2 text-lg transition-all focus:border-indigo-500 peer bg-transparent"
                    {...register("productName", { required: true })}
                  />
                  <label
                    htmlFor="productName"
                    className="absolute left-0 top-6 text-gray-400 cursor-text transition-all duration-300
                  peer-focus:top-0 peer-focus:text-xs peer-focus:text-indigo-600 peer-focus:font-semibold
                  peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs"
                  >
                    Product Name
                  </label>
                </div>

                {/* Description */}
                <div className="relative mt-10">
                  <textarea
                    defaultValue={data.description}
                    placeholder=" "
                    rows="4"
                    id="description"
                    className="w-full border-2 border-gray-100 rounded-xl p-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 transition-all text-gray-700 resize-none peer pt-8"
                    {...register("description", { required: true })}
                  />
                  <label
                    htmlFor="description"
                    className="absolute left-4 top-2 text-xs font-bold uppercase tracking-wider text-gray-400 transition-all peer-focus:text-indigo-600"
                  >
                    Full Description
                  </label>
                </div>

                {/* Pricing Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                  <div className="relative">
                    <span className="absolute left-0 bottom-2 text-gray-400 font-medium">
                      ₹
                    </span>
                    <input
                      defaultValue={data.discountPrice}
                      placeholder=" "
                      type="number"
                      id="discPrice"
                      className="w-full border-b-2 border-gray-200 pl-4 pb-2 outline-none focus:border-indigo-500 transition-all peer"
                      {...register("discountPrice", { required: true })}
                    />
                    <label
                      htmlFor="discPrice"
                      className="absolute left-0 -top-4 text-xs font-bold uppercase tracking-wider text-gray-400 peer-focus:text-indigo-600"
                    >
                      Discounted Price
                    </label>
                  </div>

                  <div className="relative">
                    <span className="absolute left-0 bottom-2 text-gray-400 font-medium">
                      ₹
                    </span>
                    <input
                      defaultValue={data.originalPrice}
                      id="orgPrice"
                      type="number"
                      placeholder=" "
                      className="w-full border-b-2 border-gray-200 pl-4 pb-2 outline-none focus:border-indigo-500 transition-all peer"
                      {...register("originalPrice", { required: true })}
                    />
                    <label
                      htmlFor="orgPrice"
                      className="absolute left-0 -top-4 text-xs font-bold uppercase tracking-wider text-gray-400 peer-focus:text-indigo-600"
                    >
                      Original Price
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-50">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Save size={20} />
                    Save Changes
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 border border-rose-100"
                  >
                    <Trash2 size={20} />
                    Delete
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UpdateProducts;
