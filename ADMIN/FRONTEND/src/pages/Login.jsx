import Sidebar from "../components/Sidebar";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAuthStore from "../store/useAuthStore";
import { useEffect } from "react";
import { Lock, Mail, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { register, handleSubmit } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: async (loginData) => {
      const response = await fetch(
        "https://store-hub-backend.onrender.com/auth/login",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          credentials: "include",
          body: JSON.stringify(loginData),
        },
      );
      if (!response.ok) throw new Error("Login failed");
      return await response.json();
    },
    onMutate: () => {
      const toastId = toast.loading("Logging in...");
      return { toastId };
    },
    onSuccess: (data, variables, context) => {
      login(data.user);
      navigate("/products");
      toast.success("Login successfull", { id: context.toastId });
    },
    onError: (error, variables, context) => {
      toast.error("Login Failed: " + error.message, { id: context.toastId });
    },
  });

  const onsubmit = (data) => mutate(data);

  useEffect(() => {
    if (isAuthenticated) navigate("/products");
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white p-8 rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100">
            <form className="space-y-6" onSubmit={handleSubmit(onsubmit)}>
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    {...register("email", { required: true })}
                    className="w-full h-12 pl-12 pr-4 bg-gray-50 border-2 border-gray-50 rounded-2xl outline-none transition-all focus:bg-white focus:border-indigo-600 text-gray-700 font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register("password", { required: true })}
                    className="w-full h-12 pl-12 pr-4 bg-gray-50 border-2 border-gray-50 rounded-2xl outline-none transition-all focus:bg-white focus:border-indigo-600 text-gray-700 font-medium"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex justify-center items-center gap-2 group"
              >
                {isPending ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-3 border-solid border-white border-t-transparent"></div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center mt-8 text-sm text-gray-500">
            Don't have an account?{" "}
            <button className="font-bold text-indigo-600 hover:underline">
              Contact Admin
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Login;
