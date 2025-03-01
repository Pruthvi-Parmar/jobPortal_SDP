import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Home2() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-6">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-10 md:p-16 text-center">
        {/* Heading Section */}
        <h1 className="text-5xl font-extrabold text-gray-900">
          Welcome to <span className="text-indigo-600">JobConnect</span>
        </h1>
        <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
          Discover endless career opportunities and connect with top employers
          to land your dream job. Find the right job faster and build your
          future with ease.
        </p>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature Item */}
          {[
            {
              title: "Seamless Job Matching",
              description: "AI-powered recommendations tailored to your skills.",
              icon: "M4 16l4-4m0 0l4-4m-4 4h12",
            },
            {
              title: "Verified Employers",
              description: "Trusted companies ensuring authentic job postings.",
              icon: "M13 16h-1v-4h-1m1-4h.01M19 9l-7 7-7-7",
            },
            {
              title: "Personalized Profiles",
              description:
                "Showcase your skills, certifications, and portfolio.",
              icon: "M12 8c1.656 0 3-1.344 3-3s-1.344-3-3-3-3 1.344-3 3 1.344 3 3 3zm0 2c-3.314 0-6 2.686-6 6h12c0-3.314-2.686-6-6-6zm0 4c-1.104 0-2 .896-2 2h4c0-1.104-.896-2-2-2z",
            },
            {
              title: "Career Growth Insights",
              description: "Industry insights and expert career guidance.",
              icon: "M9 5l7 7-7 7",
            },
            {
              title: "Easy Application Tracking",
              description: "Monitor your job applications in real-time.",
              icon: "M3 10h11M9 21v-4a3 3 0 1 1 6 0v4",
            },
            {
              title: "Secure & Private",
              description: "Your data is always protected and confidential.",
              icon: "M5 13l4 4L19 7",
            },
          ].map((feature, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={feature.icon}
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12">
          <p className="text-gray-700 text-lg">
            Ready to take the next step in your career?
          </p>
          <Link to="/signup">
            <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 text-lg rounded-lg">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home2;
