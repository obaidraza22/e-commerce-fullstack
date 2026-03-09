import { useForm } from "react-hook-form";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

function Signup() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const createAccount = async (data) => {
    const res = await fetch(
      "https://store-hub-backend.onrender.com/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    const d = await res.json();
    if (!res.ok) throw new Error(d.message);
    return d;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: createAccount,

    onMutate: () => {
      const toastId = toast.loading("Creating account...");
      return { toastId };
    },
    onSuccess: (data, variables, context) => {
      toast.success("Account created successfully", {
        id: context.toastId,
      });
      navigate("/");
    },
    onError: (error, variables, context) => {
      toast.error("Error creating account " + error.message, {
        id: context.toastId,
      });
      navigate("/auth/login");
    },
  });

  const onSubmit = (data) => {
    console.log("Signup Data:", data);
    mutate(data);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-indigo-600 p-8 text-white text-center">
            <h2 className="text-3xl font-bold">Create Account</h2>
            <p className="text-indigo-100 mt-2">Join us to start shopping</p>
          </div>

          {/* Form Section */}
          <form className="p-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <label
                  className="text-sm font-semibold text-gray-600 ml-1"
                  htmlFor="firstName"
                >
                  First Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    id="firstName"
                    placeholder="John"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                    {...register("firstName", { required: true })}
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label
                  className="text-sm font-semibold text-gray-600 ml-1"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  placeholder="Doe"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                  {...register("lastName", { required: true })}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-600 ml-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                  {...register("email", { required: true })}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                className="text-sm font-semibold text-gray-600 ml-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                  {...register("password", { required: true })}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-t-transparent animate-spin rounded-full"></div>
              ) : (
                <>
                  <p>Get Started</p>
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-indigo-600 font-bold hover:underline"
              >
                Log in
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default Signup;
