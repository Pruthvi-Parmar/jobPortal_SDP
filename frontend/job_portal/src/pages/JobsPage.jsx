import React, { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import JobCard from "@/components/JobCard";
import { ChatBubbleOvalLeftEllipsisIcon, XMarkIcon } from "@heroicons/react/24/solid";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");

  // Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
    { sender: "bot", text: "You can ask about job openings, application process, and more!" },
  ]);
  const [userMessage, setUserMessage] = useState("");

  const fetchJobs = async (keyword = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8001/v1/jobs/get-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword }), 
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const result = await response.json();

      if (result.success) {
        setJobs(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch jobs");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (keyword) => {
    setKeyword(keyword);
    fetchJobs(keyword);
  };

  const handleResetSearch = () => {
    setKeyword("");
    fetchJobs(); 
  };

  // Chatbot Functions
  const handleSendMessage = async () => {
    if (userMessage.trim() === "") return;

    console.log("inside chatbot");
    

    // Add user message to chat
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: userMessage },
    ]);

    // Send user message to backend
    try {
      const response = await fetch("http://localhost:8001/v1/chatbot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userQuery: userMessage }),
      });

      console.log("fetched");
      

      const result = await response.json();
      console.log(result);
      

      if (result.success) {
        // Add bot's response to chat
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: result.data },
        ]);
      } else {
        throw new Error(result.message || "Failed to get chatbot response");
      }
    } catch (err) {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Sorry, something went wrong. Please try again later." },
      ]);
    }

    setUserMessage("");
  };

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-3xl font-bold text-center mb-8">Job Listings</h1>
      <div className="flex justify-center mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>
      {loading && <p className="text-center mt-4">Loading...</p>}
      {error && <p className="text-center mt-4 text-red-500">{error}</p>}
      {!loading && !error && jobs.length === 0 && (
        <p className="text-center mt-4">
          No jobs found with the given filters.
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard
            key={job._id}
            jobId={job._id}
            title={job.title}
            location={job.location}
            salary={job.salary}
            type={job.type}
            overview={job.overview}
            responsibility={job.responsiblity} 
            requirement={job.requirment}
            coverImage={job.coverImage}
            status={job.status}
          />
        ))}
      </div>

      {/* Chatbot Icon */}
      <div 
        className="fixed bottom-4 right-4 bg-primary rounded-full p-4 cursor-pointer shadow-lg hover:shadow-xl transition"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-white" />
      </div>

      {/* Chatbot Interface */}
      {isChatOpen && (
        <div className="fixed bottom-16 right-4 bg-white w-80 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-primary text-white p-3 flex justify-between items-center">
            <h3 className="text-lg">Chat with us</h3>
            <XMarkIcon 
              className="h-6 w-6 cursor-pointer" 
              onClick={() => setIsChatOpen(false)} 
            />
          </div>
          <div className="p-4 h-64 overflow-y-auto space-y-2">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <p className={`p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
                  {msg.text}
                </p>
              </div>
            ))}
          </div>
          <div className="p-3 border-t">
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Type your message..."
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
