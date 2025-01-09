import React, { useState, useEffect } from "react";

export default function SignUpModal({ onClose }) {
  // Form Data State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: null,
    resume: null,
    location: "",
    salary: "",
    skills: "",
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData to send files and form data
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      // Sending the form data to the backend
      const response = await fetch("http://localhost:8001/v1/users/register", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        alert("Sign up successful!");
        onClose(); // Close the modal
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("Error during submission. Please try again.");
    }
  };

  // Disable page scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Re-enable scrolling when the modal is closed
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-700 rounded-xl p-10 w-96 shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 focus:outline-none"
        >
          ×
        </button>

        <h2 className="text-4xl font-extrabold text-white mb-8 text-center tracking-tight">
          Create Your Account
        </h2>
        <form className="space-y-6 overflow-y-auto max-h-96" onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-100 mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="block w-full bg-white border-gray-300 rounded-xl shadow-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-4"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-100 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full bg-white border-gray-300 rounded-xl shadow-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-4"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-100 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full bg-white border-gray-300 rounded-xl shadow-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-4"
              placeholder="Enter your password"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-100 mb-2">Avatar Image</label>
            <input
              type="file"
              name="avatar"
              onChange={handleChange}
              className="block w-full bg-white border-gray-300 rounded-xl shadow-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-4"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-100 mb-2">Resume</label>
            <input
              type="file"
              name="resume"
              onChange={handleChange}
              accept=".pdf,.doc,.docx"
              className="block w-full bg-white border-gray-300 rounded-xl shadow-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-4"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-100 mb-2">Preferred Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="block w-full bg-white border-gray-300 rounded-xl shadow-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-4"
              placeholder="Enter your preferred location"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-100 mb-2">Salary Range</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="block w-full bg-white border-gray-300 rounded-xl shadow-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-4"
              placeholder="Enter your expected salary range"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-100 mb-2">Skillset</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="block w-full bg-white border-gray-300 rounded-xl shadow-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-4"
              placeholder="Enter your skills"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
