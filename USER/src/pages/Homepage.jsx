import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductList from "../components/ProductList";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";

function Homepage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-20 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Text Content */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} />
              New Spring Collection 2026
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-none tracking-tighter">
              Style that <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                Speaks.
              </span>
            </h1>

            <p className="text-gray-500 text-xl leading-relaxed max-w-md">
              Experience the perfect blend of minimalist design and premium
              quality. Crafted for those who appreciate the finer details.
            </p>

            <div className="pt-4">
              <button
                onClick={() => navigate("/products")}
                className="flex items-center justify-center gap-4 bg-gray-900 text-white px-10 py-6 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-100 group"
              >
                Shop Collection
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </button>
            </div>
          </div>

          {/* Right Side: Human Fashion Image */}
          <div className="order-1 lg:order-2">
            <div className="relative aspect-4/5 w-full max-w-xl mx-auto">
              {/* Decorative Blur Background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-100 rounded-full blur-[120px] opacity-40"></div>

              {/* Main Image Container */}
              <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
                  alt="Stylish Fashion"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />

                {/* Subtle Overlay Card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20">
                  <p className="text-white font-bold tracking-tight text-lg">
                    Modern Essentials '26
                  </p>
                  <p className="text-white/70 text-sm">
                    Curated Minimalist Wardrobe
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-gray-50 py-24 rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-gray-900 tracking-tight">
                Our Products
              </h2>
              <p className="text-gray-500 text-lg">
                Discover what's trending this week.
              </p>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="text-indigo-600 font-bold hover:gap-4 transition-all flex items-center gap-2 group"
            >
              Browse All{" "}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          <ProductList />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Homepage;
