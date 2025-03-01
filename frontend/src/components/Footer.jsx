import { LinkedinIcon, TwitterIcon, GithubIcon } from "lucide-react";


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-10">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Logo & Tagline */}
        <div className="flex flex-col space-y-3">
          <h2 className="text-2xl font-semibold text-white">JobConnect</h2>
          <p className="text-sm text-gray-400">
            Empowering careers, connecting talent with opportunity.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-2">
          <h3 className="text-lg font-semibold text-white">Quick Links</h3>
          <a href="/jobs" className="hover:text-gray-100 transition">Find Jobs</a>
          <a href="/about" className="hover:text-gray-100 transition">About Us</a>
          <a href="/contact" className="hover:text-gray-100 transition">Contact</a>
          <a href="/privacy" className="hover:text-gray-100 transition">Privacy Policy</a>
          <a href="/terms" className="hover:text-gray-100 transition">Terms & Conditions</a>
        </div>

        {/* Social Media & Contact */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-lg font-semibold text-white">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition">
              <LinkedinIcon size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <TwitterIcon size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <GithubIcon size={20} />
            </a>
          </div>
          <p className="text-sm text-gray-400">Email: support@jobconnect.com</p>
        </div>

      </div>

      {/* Copyright */}
      <div className="mt-6 border-t border-gray-700 text-center text-sm py-4">
        © {new Date().getFullYear()} JobConnect. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
