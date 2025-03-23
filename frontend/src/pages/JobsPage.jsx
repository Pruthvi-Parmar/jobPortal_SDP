import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Briefcase,
  MessageCircle,
  X,
  MapPin,
  Clock,
  Filter,
  ChevronDown,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react"
import JobCard from "../components/JobCard"

const JobsPage = () => {
  // State for jobs and loading
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // State for search filters
  const [keyword, setKeyword] = useState("")
  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [type, setType] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // State for chat
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
    { sender: "bot", text: "You can ask about job openings, application process, and more!" },
  ])
  const [userMessage, setUserMessage] = useState("")
  const [isSendingMessage, setIsSendingMessage] = useState(false)

  // Refs
  const chatContainerRef = useRef(null)
  const searchInputRef = useRef(null)

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  // Focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  const fetchJobs = async (searchParams = {}) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:8001/v1/jobs/get-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchParams),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch jobs")
      }

      const result = await response.json()

      if (result.success) {
        setJobs(result.data)
      } else {
        throw new Error(result.message || "Failed to fetch jobs")
      }
    } catch (err) {
      setError(err.message)
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()

    // Create search params object with only non-empty values
    const searchParams = {}
    if (keyword.trim()) searchParams.keyword = keyword.trim()
    if (title.trim()) searchParams.title = title.trim()
    if (location.trim()) searchParams.location = location.trim()
    if (type.trim()) searchParams.type = type.trim()

    fetchJobs(searchParams)
  }

  const handleReset = () => {
    setKeyword("")
    setTitle("")
    setLocation("")
    setType("")
    fetchJobs()
  }

  const handleSendMessage = async () => {
    if (userMessage.trim() === "" || isSendingMessage) return

    // Add user message to chat
    setChatMessages((prevMessages) => [...prevMessages, { sender: "user", text: userMessage }])

    // Clear input and set loading
    const messageToBeSent = userMessage
    setUserMessage("")
    setIsSendingMessage(true)

    try {
      const response = await fetch("http://localhost:8001/v1/chatbot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userQuery: messageToBeSent }),
      })

      const result = await response.json()

      if (result.success) {
        setChatMessages((prevMessages) => [...prevMessages, { sender: "bot", text: result.data }])
      } else {
        throw new Error(result.message || "Failed to get chatbot response")
      }
    } catch (err) {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Sorry, something went wrong. Please try again later." },
      ])
    } finally {
      setIsSendingMessage(false)
    }
  }

  // Job type options
  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"]

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Find Your Dream Job
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover thousands of job opportunities from top companies around the world
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <form onSubmit={handleSearch}>
            <div className="bg-background rounded-xl shadow-lg border border-border/30 overflow-hidden transition-all">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 flex items-center gap-2 p-4 border-b md:border-b-0 md:border-r border-border/30">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search jobs by keywords..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full outline-none bg-transparent"
                  />
                </div>

                <div className="flex items-center p-4">
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Filter className="w-5 h-5" />
                    <span>Filters</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                  </button>

                  <div className="ml-auto flex gap-2">
                    {(keyword || title || location || type) && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Reset
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-t border-border/30"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-muted-foreground">Job Title</label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="e.g. Software Engineer"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 rounded-lg border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-muted-foreground">Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="e.g. New York"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 rounded-lg border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1 text-muted-foreground">Job Type</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 rounded-lg border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30 appearance-none"
                          >
                            <option value="">All Types</option>
                            {jobTypes.map((jobType) => (
                              <option key={jobType} value={jobType}>
                                {jobType}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </motion.div>

        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Searching for jobs...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="bg-destructive/10 rounded-lg p-6">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Error Loading Jobs</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <button
                onClick={() => fetchJobs()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="bg-muted/50 rounded-lg p-8">
              <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No Jobs Found</h3>
              <p className="text-muted-foreground mb-6">
                We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Found <span className="font-medium text-foreground">{jobs.length}</span> jobs
              </p>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {jobs.map((job) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {console.log(job)}
                  <JobCard {...job} jobId={job._id} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}

        {/* Chat Button */}
        <motion.button
          className="fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </motion.button>

        {/* Chat Window */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-24 right-6 w-80 md:w-96 bg-background rounded-xl shadow-2xl overflow-hidden border border-border/50 z-50"
            >
              <div className="bg-primary text-primary-foreground p-4">
                <h3 className="text-lg font-medium">Job Search Assistant</h3>
                <p className="text-primary-foreground/80 text-sm">Ask me anything about jobs or applications</p>
              </div>

              <div ref={chatContainerRef} className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {chatMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {isSendingMessage && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                      <div className="flex space-x-2">
                        <div
                          className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="p-4 border-t border-border/30">
                <form
                  className="flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                >
                  <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 rounded-lg border border-border/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                    disabled={isSendingMessage}
                  />
                  <button
                    type="submit"
                    disabled={isSendingMessage || !userMessage.trim()}
                    className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default JobsPage

