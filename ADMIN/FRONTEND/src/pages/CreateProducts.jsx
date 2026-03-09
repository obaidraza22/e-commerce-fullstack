import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useForm } from "react-hook-form";
import { UploadCloud, X, PlusCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";

function CreateProducts() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("productName", data.productName);
    formData.append("description", data.description);
    formData.append("originalPrice", data.originalPrice);
    formData.append("discountPrice", data.discountPrice);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }
    const res = await fetch(
      "https://store-hub-backend.onrender.com/product/add-product",
      {
        method: "POST",
        credentials: "include",
        body: formData,
      },
    );
    const d = await res.json();
    console.log(d);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: onSubmit,
    onMutate: () => {
      const toastId = toast.loading("Creating Product...");
      return { toastId };
    },
    onSuccess: (data, variables, context) => {
      toast.success("Product created successfully", { id: context.toastId });
      navigate("/products");
    },
    onError: (error, variables, context) => {
      toast.error("Error occured: " + error.message, { id: context.toastId });
    },
  });

  const handleChange = (e) => {
    const selectedFiles = e.target.files[0];
    if (selectedFiles) {
      const url = URL.createObjectURL(selectedFiles);
      setPreview(url);
      if (preview) URL.revokeObjectURL(preview);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setValue("image", null);
    const input = document.getElementById("image");
    if (input) input.value = "";
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex grow justify-center items-start py-12 px-4">
        <div className="w-full max-w-2xl bg-white shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden border border-gray-100">
          {/* Header Section */}
          <div className="bg-linear-to-r from-indigo-600 to-violet-600 p-8 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <PlusCircle size={24} />
              Create New Product
            </h2>
            <p className="text-indigo-100 text-sm mt-1">
              Fill in the details to add a new item to your catalog.
            </p>
          </div>

          <form className="p-8 space-y-8" onSubmit={handleSubmit(mutate)}>
            {/* Product Name */}
            <div className="relative group">
              <input
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
            <div className="relative">
              <textarea
                autoComplete="off"
                minLength="50"
                maxLength="3000"
                placeholder=" "
                rows="4"
                id="description"
                className="w-full border-2 border-gray-100 rounded-xl p-4 pt-8 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 transition-all text-gray-700 resize-none peer"
                {...register("description", { required: true })}
              />
              <label
                htmlFor="description"
                className="absolute left-4 top-2 text-xs font-bold uppercase tracking-wider text-gray-400 peer-focus:text-indigo-600"
              >
                Product Description
              </label>
            </div>

            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <span className="absolute left-0 bottom-2 text-gray-400 font-medium">
                  ₹
                </span>
                <input
                  placeholder=" "
                  type="number"
                  id="discPrice"
                  className="w-full border-b-2 border-gray-200 pl-5 pb-2 outline-none focus:border-indigo-500 transition-all peer"
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
                  id="orgPrice"
                  type="number"
                  placeholder=" "
                  className="w-full border-b-2 border-gray-200 pl-5 pb-2 outline-none focus:border-indigo-500 transition-all peer"
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

            {/* Image Upload Section */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Product Image
              </label>

              <div className="flex items-center justify-center w-full">
                {!preview ? (
                  <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:bg-gray-50 hover:border-indigo-400 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-12 h-12 mb-3 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold text-indigo-600">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG or WebP (Max 5MB)
                      </p>
                    </div>
                    <input
                      id="image"
                      type="file"
                      className="hidden"
                      {...register("image", {
                        required: true,
                        onChange: (e) => handleChange(e),
                      })}
                    />
                  </label>
                ) : (
                  <div className="relative w-full h-64 rounded-3xl overflow-hidden border-2 border-gray-100 shadow-inner group">
                    <img
                      src={preview}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-rose-600 p-2 rounded-full shadow-lg hover:bg-rose-600 hover:text-white transition-all transform hover:scale-110"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isPending ? "Loading..." : "Create Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProducts;
