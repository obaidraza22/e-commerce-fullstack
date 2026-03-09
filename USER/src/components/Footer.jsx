import { Instagram, Twitter, Github } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        {/* Brand Logo */}
        <h2 className="text-xl font-black text-gray-900 tracking-tighter mb-8">
          STORE<span className="text-indigo-600">.</span>
        </h2>

        {/* Minimalist Navigation */}
        <nav className="flex flex-wrap justify-center gap-x-10 gap-y-4 mb-10">
          {["Shop", "Privacy", "Terms", "Contact"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm font-medium text-gray-400 hover:text-indigo-600 transition-colors"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Social Icons */}
        <div className="flex gap-8 mb-10 text-gray-300">
          <a href="#" className="hover:text-gray-900 transition-colors">
            <Instagram size={20} />
          </a>
          <a href="#" className="hover:text-gray-900 transition-colors">
            <Twitter size={20} />
          </a>
          <a href="#" className="hover:text-gray-900 transition-colors">
            <Github size={20} />
          </a>
        </div>

        {/* Bottom Copyright */}
        <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 font-bold">
          © 2026 Store Inc. Built for the modern world.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
