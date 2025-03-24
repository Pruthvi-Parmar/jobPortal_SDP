import { Linkedin, Twitter, Github, Mail, Phone, MapPin, ChevronRight, BookOpen, FileText, BarChart, Award } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-200">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4 mx-8">
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
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
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
                <Link to="/raise-ticket" className="text-slate-400 hover:text-white flex items-center transition-colors">
                  <ChevronRight className="h-4 w-4 mr-1" />
                  Raise ticket
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
          <div >
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex">
                <Mail className="h-5 w-5 mr-3 text-secondary flex-shrink-0" />
                <span className="text-slate-400">support@jobconnect.com</span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 mr-3 text-secondary flex-shrink-0" />
                <span className="text-slate-400">+91 6352510273</span>
              </li>
              <li className="flex">
                <MapPin className="h-5 w-5 mr-3 text-secondary flex-shrink-0" />
                <span className="text-slate-400">123 Employment Ave, Career City, JC 54321</span>
              </li>
            </ul>
          </div>

          {/* Career Resources - Added instead of Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Career Resources</h3>
            <ul className="space-y-3">
              <li className="flex">
                <BookOpen className="h-5 w-5 mr-3 text-secondary flex-shrink-0" />
                <Link href="/blog" className="text-slate-400 hover:text-white transition-colors">
                  Career Blog
                </Link>
              </li>
              <li className="flex">
                <FileText className="h-5 w-5 mr-3 text-secondary flex-shrink-0" />
                <Link href="/resume-tips" className="text-slate-400 hover:text-white transition-colors">
                  Resume Writing Tips
                </Link>
              </li>
              <li className="flex">
                <BarChart className="h-5 w-5 mr-3 text-secondary flex-shrink-0" />
                <Link href="/salary-guide" className="text-slate-400 hover:text-white transition-colors">
                  Salary Guides
                </Link>
              </li>
              <li className="flex">
                <Award className="h-5 w-5 mr-3 text-secondary flex-shrink-0" />
                <Link href="/certifications" className="text-slate-400 hover:text-white transition-colors">
                  Recommended Certifications
                </Link>
              </li>
            </ul>
            <div className="mt-4">
              <Link 
                href="/resources" 
                className="text-primary hover:text-primary/90 text-sm font-medium transition-colors"
              >
                View all resources →
              </Link>
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