"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"
import {
  FileText,
  CheckCircle,
  Loader2,
  FileUp,
  Award,
  TrendingUp,
  Zap,
  ChevronRight,
  Download,
  ExternalLink,
  AlertTriangle,
  Star,
  BarChart,
  Target,
  XCircle,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const ATS = () => {
  const [resume, setResume] = useState(null)
  const [resumeUrl, setResumeUrl] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [analysisOption, setAnalysisOption] = useState("Quick Scan")
  const [result, setResult] = useState(null)
  const [parsedResult, setParsedResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/users/getCurrentUser`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const result = await response.json()
        if (result.success) {
          const userData = result.data
          setResumeUrl(userData.resume)
        } else {
          throw new Error(result.message || "Failed to fetch user data")
        }
      } catch (error) {
        toast.error("Error fetching user data", {
          description: error.message,
        })
      } finally {
        setInitialLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Parse the result when it changes
  useEffect(() => {
    if (result) {
      const parsed = parseAnalysisResult(result)
      setParsedResult(parsed)
    } else {
      setParsedResult(null)
    }
  }, [result])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Invalid file type", {
          description: "Please upload a PDF file",
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File too large", {
          description: "Maximum file size is 5MB",
        })
        return
      }

      setResume(file)
      setResumeUrl("")
      toast.success("Resume uploaded", {
        description: file.name,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!resume && !resumeUrl) {
      toast.error("No resume selected", {
        description: "Please upload a resume or use your existing one",
      })
      return
    }

    setLoading(true)
    setResult(null)
    setParsedResult(null)

    try {
      const requestBody = {
        jobDescription,
        analysisOption,
      }

      if (resume) {
        // Convert file to Base64 to send it in JSON format
        const fileBase64 = await convertFileToBase64(resume)
        requestBody.resume = fileBase64
      } else {
        requestBody.resumeUrl = resumeUrl
      }

      const response = await fetch(`${API_URL}/resume/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      //console.log("Response data:", data)

      if (response.ok) {
        // Access the analysis from the response data
        setResult(data.analysis || data.data?.analysis)
        toast.success("Analysis complete!")
      } else {
        toast.error("Analysis failed", {
          description: data.message || "An error occurred during analysis",
        })
      }
    } catch (error) {
      toast.error("Error", {
        description: error.message || "An unexpected error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  // Helper function to convert file to Base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result.split(",")[1]) // Remove Data URL prefix
      reader.onerror = (error) => reject(error)
    })
  }

  // Function to parse the analysis result text into structured data
  const parseAnalysisResult = (text) => {
    if (!text) return null

    // If it's already an object, return it
    if (typeof text !== "string") {
      return text
    }

    // Initialize the parsed result with default structure
    const parsed = {
      profession: "",
      atsScore: 0,
      strengths: [],
      improvements: [],
      keywordMatches: [],
      missingKeywords: [],
      detailedFeedback: "",
      skillsRatings: {},
    }

    try {
      // Extract profession
      const professionMatch =
        text.match(/best-matching profession:?\s*([^\n.]+)/i) || text.match(/profession:?\s*([^\n.]+)/i)
      if (professionMatch) {
        parsed.profession = professionMatch[1].trim()
      }

      // Extract ATS score
      const scoreMatch =
        text.match(/ATS score:?\s*(\d+)\s*\/\s*100/i) || text.match(/ATS compatibility score:?\s*(\d+)/i)
      if (scoreMatch) {
        parsed.atsScore = Number.parseInt(scoreMatch[1])
      }

      // Extract strengths
      const strengthsSection = text.match(/strengths:?\s*([\s\S]*?)(?=improvements:|suggestions:|$)/i)
      if (strengthsSection) {
        const strengthsList = strengthsSection[1].split(/\n\s*[-•*]\s*/).filter(Boolean)
        parsed.strengths = strengthsList.map((s) => s.trim()).filter((s) => s.length > 0)
      }

      // Extract improvements
      const improvementsSection =
        text.match(/improvements:?\s*([\s\S]*?)(?=strengths:|optimization points:|$)/i) ||
        text.match(/suggestions:?\s*([\s\S]*?)(?=strengths:|optimization points:|$)/i) ||
        text.match(/optimization points:?\s*([\s\S]*?)(?=strengths:|improvements:|$)/i)
      if (improvementsSection) {
        const improvementsList = improvementsSection[1].split(/\n\s*[-•*]\s*/).filter(Boolean)
        parsed.improvements = improvementsList.map((i) => i.trim()).filter((i) => i.length > 0)
      }

      // Extract missing keywords for ATS Optimization
      const missingKeywordsSection = text.match(/missing keywords:?\s*([\s\S]*?)(?=improvements:|suggestions:|$)/i)
      if (missingKeywordsSection) {
        const keywordsList = missingKeywordsSection[1].split(/\n\s*[-•*]\s*/).filter(Boolean)
        parsed.missingKeywords = keywordsList.map((k) => k.trim()).filter((k) => k.length > 0)
      }

      // Extract skills ratings for Detailed Analysis
      const skillsSection = text.match(/skills:?\s*([\s\S]*?)(?=overall|ats score:|$)/i)
      if (skillsSection) {
        const skillsText = skillsSection[1]
        const skillMatches = skillsText.matchAll(/([A-Za-z\s]+):\s*(\d+)(?:\/10)?/g)
        for (const match of skillMatches) {
          const skill = match[1].trim()
          const rating = Number.parseInt(match[2])
          if (skill && !isNaN(rating)) {
            parsed.skillsRatings[skill] = rating
          }
        }
      }

      // If we couldn't parse much, store the whole text as detailed feedback
      if (
        Object.values(parsed).every((v) =>
          Array.isArray(v) ? v.length === 0 : typeof v === "object" ? Object.keys(v).length === 0 : !v,
        )
      ) {
        parsed.detailedFeedback = text
      } else if (text.length > 0) {
        // Store the original text as detailed feedback
        parsed.detailedFeedback = text
      }

      return parsed
    } catch (error) {
      console.error("Error parsing analysis result:", error)
      // If parsing fails, return the original text as detailed feedback
      return {
        detailedFeedback: text,
      }
    }
  }

  // Function to get score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  // Function to get badge variant based on score
  const getBadgeVariant = (score) => {
    if (score >= 80) return "success"
    if (score >= 60) return "warning"
    return "destructive"
  }

  // Function to get score label based on value
  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    return "Needs Improvement"
  }

  // Function to render the appropriate result based on the API response structure
  const renderAnalysisResult = () => {
    if (!parsedResult) return null

    return (
      <Card className="mt-8 border-t-4 border-t-primary">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Resume Analysis Results</CardTitle>
              <CardDescription>Analysis type: {analysisOption}</CardDescription>
            </div>
            {parsedResult.atsScore > 0 && (
              <div className="flex flex-col items-center">
                <div className="text-sm text-muted-foreground mb-1">ATS Compatibility</div>
                <div className="relative h-24 w-24">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-2xl font-bold ${getScoreColor(parsedResult.atsScore)}`}>
                      {parsedResult.atsScore}
                    </span>
                  </div>
                  <svg className="h-24 w-24" viewBox="0 0 100 100">
                    <circle
                      className="text-muted stroke-current"
                      strokeWidth="10"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className={`${parsedResult.atsScore >= 80 ? "text-green-500" : parsedResult.atsScore >= 60 ? "text-amber-500" : "text-red-500"} stroke-current`}
                      strokeWidth="10"
                      strokeLinecap="round"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                      strokeDasharray={`${parsedResult.atsScore * 2.51} 251`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>
                <Badge variant={getBadgeVariant(parsedResult.atsScore)} className="mt-1">
                  {getScoreLabel(parsedResult.atsScore)}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="raw">Raw Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {parsedResult.profession && (
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <Award className="h-5 w-5 text-primary" />
                    Best Matching Profession
                  </h3>
                  <div className="bg-muted p-4 rounded-md">
                    <p className="font-medium">{parsedResult.profession}</p>
                  </div>
                </div>
              )}

              {parsedResult.strengths && parsedResult.strengths.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <Star className="h-5 w-5 text-primary" />
                    Key Strengths
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {parsedResult.strengths.map((strength, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 border rounded-md">
                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {parsedResult.improvements && parsedResult.improvements.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    Suggested Improvements
                  </h3>
                  <div className="space-y-3">
                    {parsedResult.improvements.map((improvement, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 border rounded-md bg-muted/50">
                        <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {parsedResult.missingKeywords && parsedResult.missingKeywords.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-primary" />
                    Missing Keywords
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {parsedResult.missingKeywords.map((keyword, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span>{keyword}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details">
              {Object.keys(parsedResult.skillsRatings).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                    <BarChart className="h-5 w-5 text-primary" />
                    Skills Analysis
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(parsedResult.skillsRatings).map(([skill, rating]) => (
                      <div key={skill} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{skill}</span>
                          <span
                            className={rating >= 7 ? "text-green-600" : rating >= 5 ? "text-amber-600" : "text-red-600"}
                          >
                            {rating}/10
                          </span>
                        </div>
                        <Progress value={rating * 10} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-primary" />
                  Detailed Feedback
                </h3>
                <div className="bg-muted p-4 rounded-md whitespace-pre-line">
                  {parsedResult.detailedFeedback || "No detailed feedback available."}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="raw">
              <div className="bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
                <pre className="text-sm whitespace-pre-wrap">
                  {typeof result === "string" ? result : JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button
            variant="outline"
            onClick={() => {
              setResult(null)
              setParsedResult(null)
            }}
          >
            New Analysis
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Resume Analysis Tool
        </h1>
        <p className="text-muted-foreground mt-2">
          Optimize your resume for Applicant Tracking Systems and get personalized feedback
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analyze Your Resume</CardTitle>
          <CardDescription>
            Upload your resume or use your existing one to get detailed feedback and ATS compatibility score
          </CardDescription>
        </CardHeader>
        <CardContent>
          {initialLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Resume</label>

                {resumeUrl ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border rounded-md bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium">Existing Resume</p>
                      <p className="text-sm text-muted-foreground truncate">{resumeUrl.split("/").pop()}</p>
                    </div>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" asChild>
                              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Resume</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <Button variant="outline" size="sm" onClick={() => setResumeUrl("")}>
                        Use Different Resume
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid w-full items-center gap-1.5">
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center hover:border-primary/50 transition-colors"
                    >
                      <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="font-medium">Upload your resume</p>
                      <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
                      <p className="text-xs text-muted-foreground mt-2">PDF format, max 5MB</p>

                      {resume && (
                        <div className="mt-4 flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="font-medium">{resume.name}</span>
                          <Badge variant="outline" className="ml-2">
                            {(resume.size / 1024).toFixed(0)} KB
                          </Badge>
                        </div>
                      )}
                    </label>
                    <Input
                      id="resume-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Job Description (optional)</label>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here for better matching results..."
                  rows="4"
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Adding a job description helps us tailor the analysis to specific requirements
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Analysis Type</label>
                <Select value={analysisOption} onValueChange={setAnalysisOption}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select analysis type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quick Scan">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        <span>Quick Scan</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Detailed Analysis">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Detailed Analysis</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="ATS Optimization">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span>ATS Optimization</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {analysisOption === "Quick Scan" && "Fast overview of your resume with basic ATS compatibility check"}
                  {analysisOption === "Detailed Analysis" &&
                    "In-depth analysis of your resume with comprehensive feedback"}
                  {analysisOption === "ATS Optimization" &&
                    "Focused on maximizing your resume's performance in ATS systems"}
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading || (!resume && !resumeUrl)}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {renderAnalysisResult()}
    </div>
  )
}

export default ATS

