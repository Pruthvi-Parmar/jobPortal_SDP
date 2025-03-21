import { Linkedin, Twitter, Github, Mail, Phone, MapPin, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"; 

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-200">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">JobConnect</h2>
            <p className="text-slate-400 max-w-xs">
              Empowering careers, connecting talent with opportunity. Find your dream job or the perfect candidate.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </Link>
              <Link
                href="#"
                className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </Link>
              <Link
                href="#"
                className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/jobs" className="text-slate-400 hover:text-white flex items-center transition-colors">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link href="/post-job" className="text-slate-400 hover:text-white flex items-center transition-colors">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white flex items-center transition-colors">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white flex items-center transition-colors">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-white flex items-center transition-colors">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-white flex items-center transition-colors">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-3 text-primary mt-0.5" />
                <span className="text-slate-400">support@jobconnect.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-3 text-primary mt-0.5" />
                <span className="text-slate-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-primary mt-0.5" />
                <span className="text-slate-400">123 Employment Ave, Career City, JC 54321</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Newsletter</h3>
            <p className="text-slate-400">
              Subscribe to our newsletter for the latest job opportunities and career advice.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
              <Button className="shrink-0">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">© {currentYear} JobConnect. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-slate-400 hover:text-white text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-slate-400 hover:text-white text-sm transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-slate-400 hover:text-white text-sm transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

