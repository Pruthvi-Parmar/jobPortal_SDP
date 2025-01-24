
import React from 'react';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="max-w-5xl w-full bg-white shadow-md rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Welcome to Job Portal
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Discover endless career opportunities and connect with top employers
            to find your dream job or grow your organization. Designed to make
            hiring and job searching easier, faster, and more efficient.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature 1 */}
          <div className="flex items-start">
            <div className="flex-shrink-0">
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
                    d="M4 16l4-4m0 0l4-4m-4 4h12"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Seamless Job Matching
              </h3>
              <p className="mt-2 text-gray-600">
                Our AI-powered algorithm matches you with jobs tailored to your
                skills and experience.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start">
            <div className="flex-shrink-0">
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
                    d="M13 16h-1v-4h-1m1-4h.01M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Verified Employers
              </h3>
              <p className="mt-2 text-gray-600">
                Only trusted and verified companies post jobs on our platform to
                ensure authenticity.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start">
            <div className="flex-shrink-0">
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
                    d="M12 8c1.656 0 3-1.344 3-3s-1.344-3-3-3-3 1.344-3 3 1.344 3 3 3zm0 2c-3.314 0-6 2.686-6 6h12c0-3.314-2.686-6-6-6zm0 4c-1.104 0-2 .896-2 2h4c0-1.104-.896-2-2-2z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Personalized Profiles
              </h3>
              <p className="mt-2 text-gray-600">
                Showcase your skills, certifications, and portfolio to
                employers with our customizable profiles.
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-start">
            <div className="flex-shrink-0">
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Career Growth Insights
              </h3>
              <p className="mt-2 text-gray-600">
                Get career tips, industry insights, and expert guidance to
                enhance your professional growth.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-500">
            Ready to start your journey?{' '}
            <a href="/signup" className="text-indigo-600 hover:underline">
              Sign up
            </a>{' '}
            today and take the next step in your career.
          </p>
        </div>
      </div>

    </div>
  );
}

export default Home;