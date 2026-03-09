import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Navigate, Link } from "react-router"; // Added Link for styling the 'signup' redirect
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import useAuthStore from "../store/authStore";
import { Mail, Lock, LogIn } from "lucide-react"; // Matching your icon set

function Login() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const login = useAuthStore((state) => state.login);

  const { register, handleSubmit } = useForm();

  const authLogin = async (data) => {
    const res = await fetch(
      "https://store-hub-backend.onrender.com/auth/login",
      {
        method: "POST",
        credentials: "include",
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
    mutationFn: authLogin,
    onMutate: () => {
      const toastId = toast.loading("Logging in...");
      return { toastId };
    },
    onSuccess: (data, variables, context) => {
      login(data.user);
      toast.success("Loggin successfull", { id: context.toastId });
    },
    onError: (error, variables, context) => {
      toast.error("Error logging in: " + error.message, {
        id: context.toastId,
      });
    },
  });

  const onSubmit = (data) => mutate(data);
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transition-all hover:shadow-2xl hover:shadow-gray-300/50">
          {/* Hero Header */}
          <div className="bg-indigo-600 p-10 text-white text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-black tracking-tight">
                Welcome Back
              </h2>
              <p className="text-indigo-100 mt-2 font-medium">
                Log in to start shopping
              </p>
            </div>
            {/* Decorative circle */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full opacity-50"></div>
          </div>

          <form className="p-10 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="space-y-2">
              <label
                className="text-sm font-bold text-gray-700 ml-1"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                  size={20}
                />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@storehub.com"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-gray-800 font-medium"
                  {...register("email", { required: true })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                className="text-sm font-bold text-gray-700 ml-1"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                  size={20}
                />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all text-gray-800 font-medium"
                  {...register("password", { required: true })}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gray-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-gray-200 active:scale-[0.98] flex items-center justify-center gap-3 mt-4 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isPending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="tracking-wide">Sign In</span>
                  <LogIn
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>

            {/* Footer Redirect */}
            <div className="pt-6 text-center">
              <p className="text-gray-500 font-medium text-sm">
                Don't have an account?{" "}
                <Link
                  to="/auth/signup"
                  className="text-indigo-600 font-bold hover:underline hover:text-indigo-700 transition-colors"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
