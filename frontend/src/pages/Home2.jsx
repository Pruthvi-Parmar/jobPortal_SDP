import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import {
  Search,
  Shield,
  User,
  TrendingUp,
  ListChecks,
  Lock,
  ArrowRight,
  Briefcase,
  Building,
  Users,
  Award,
  CheckCircle,
} from "lucide-react"
import Hero3DScene from "../components/hero-3d-scene"
import ModernHeroVisual from "@/components/modern-hero-visual"

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-20 lg:pt-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="flex flex-col space-y-8 max-w-2xl">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
                  The #1 Job Platform
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
                  Welcome to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    JobConnect
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
                  Discover endless career opportunities and connect with top employers to land your dream job. Find the
                  right job faster and build your future with ease.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-base font-medium">
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                {/* <Link to="/jobs">
                  <Button
                    variant="outline"
                    className="h-12 px-6 border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-lg text-base font-medium"
                  >
                    Browse Jobs
                  </Button>
                </Link> */}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white overflow-hidden bg-indigo-100"
                    >
                      <img
                        src={`https://randomuser.me/api/portraits/thumb/men/${i}.jpg`} // RandomUser.me URL
                        alt={`User ${i}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <span>
                  Trusted by <span className="font-medium text-indigo-600">10,000+</span> job seekers
                </span>
              </div>
            </div>

            {/* Replace static image with 3D scene */}
            {/* <Hero3DScene /> */}
            <ModernHeroVisual/>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute top-0 right-0 -z-10 h-64 w-64 bg-indigo-100 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
      </section>

      {/* Rest of the page content remains unchanged */}
      {/* Trusted By Section */}
      <section className="py-12 border-y border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Trusted by leading companies</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[
              "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", // Google
              "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", // Amazon
              "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", // Apple
              "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", // Netflix
              "https://upload.wikimedia.org/wikipedia/commons/0/01/LinkedIn_Logo.svg", // LinkedIn
            ].map((logo, i) => (
              <div
                key={i}
                className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <img src={logo || "/placeholder.svg"} alt={`Company ${i + 1}`} className="h-10 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 mb-4">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
              Key Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Everything you need to accelerate your job search
            </h2>
            <p className="text-lg text-gray-600">
              Our platform provides all the tools and resources you need to find your dream job faster and easier than
              ever before.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                title: "Seamless Job Matching",
                description: "AI-powered recommendations tailored to your skills and preferences.",
                icon: <Search className="h-6 w-6" />,
              },
              {
                title: "Verified Employers",
                description: "Trusted companies ensuring authentic job postings and opportunities.",
                icon: <Shield className="h-6 w-6" />,
              },
              {
                title: "Personalized Profiles",
                description: "Showcase your skills, certifications, and portfolio to stand out.",
                icon: <User className="h-6 w-6" />,
              },
              {
                title: "Career Growth Insights",
                description: "Industry insights and expert career guidance to help you advance.",
                icon: <TrendingUp className="h-6 w-6" />,
              },
              {
                title: "Application Tracking",
                description: "Monitor your job applications in real-time with status updates.",
                icon: <ListChecks className="h-6 w-6" />,
              },
              {
                title: "Secure & Private",
                description: "Your data is always protected and confidential with our platform.",
                icon: <Lock className="h-6 w-6" />,
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white mb-4 backdrop-blur-sm">
              How It Works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Find your dream job in three simple steps
            </h2>
            <p className="text-lg text-white/80">Our streamlined process makes job hunting easier than ever before</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                title: "Create Your Profile",
                description: "Sign up and build your professional profile highlighting your skills and experience.",
                icon: <User className="h-8 w-8" />,
                step: "01",
              },
              {
                title: "Explore Opportunities",
                description: "Browse through thousands of verified job listings or get AI-powered recommendations.",
                icon: <Briefcase className="h-8 w-8" />,
                step: "02",
              },
              {
                title: "Apply & Connect",
                description: "Apply to jobs with a single click and connect directly with hiring managers.",
                icon: <CheckCircle className="h-8 w-8" />,
                step: "03",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 h-full">
                  <div className="absolute -top-4 -right-4 h-12 w-12 flex items-center justify-center rounded-full bg-white text-indigo-600 font-bold text-lg">
                    {step.step}
                  </div>
                  <div className="h-16 w-16 flex items-center justify-center rounded-full bg-white/20 text-white mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-white/80">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10+", label: "Active Jobs", icon: <Briefcase className="h-6 w-6" /> },
              { value: "250+", label: "Companies", icon: <Building className="h-6 w-6" /> },
              { value: "15+", label: "Job Seekers", icon: <Users className="h-6 w-6" /> },
              { value: "95%", label: "Success Rate", icon: <Award className="h-6 w-6" /> },
            ].map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-6">
              Ready to take the next step in your career?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who have already found their dream jobs through JobConnect. Your next
              opportunity is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-base font-medium">
                  Get Started Now
                </Button>
              </Link>
              {/* <Link to="/employers">
                <Button
                  variant="outline"
                  className="h-12 px-8 border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-lg text-base font-medium"
                >
                  For Employers
                </Button>
              </Link> */}
            </div>
          </div>
        </div>
      </section>

      {/* Footer section is commented out in the original code */}
    </div>
  )
}

export default HomePage

