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
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8001/v1/users/getCurrentUser", {
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

      const response = await fetch("http://localhost:8001/v1/resume/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Properly parse the response based on its structure
        setResult(data.data)
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

  // Function to render the appropriate result based on the API response structure
  const renderAnalysisResult = () => {
    if (!result) return null

    // This is a placeholder for the actual response structure
    // You'll need to adjust this based on the actual API response format
    const {
      atsScore = 0,
      matchingProfession = "",
      keyStrengths = [],
      improvements = [],
      keywordMatch = [],
      skillsAnalysis = {},
      detailedFeedback = "",
    } = result

    return (
      <Card className="mt-8 border-t-4 border-t-primary">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Resume Analysis Results</CardTitle>
              <CardDescription>Analysis type: {analysisOption}</CardDescription>
            </div>
            <Badge variant={getBadgeVariant(atsScore)} className="text-md px-3 py-1">
              ATS Score: {atsScore}/100
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                  <Award className="h-5 w-5 text-primary" />
                  Best Matching Profession
                </h3>
                <p className="text-muted-foreground bg-muted p-3 rounded-md">{matchingProfession || "Not specified"}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  ATS Compatibility
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Score: {atsScore}/100</span>
                    <span className={getScoreColor(atsScore)}>
                      {atsScore >= 80 ? "Excellent" : atsScore >= 60 ? "Good" : "Needs Improvement"}
                    </span>
                  </div>
                  <Progress value={atsScore} className="h-2" />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Key Strengths
                </h3>
                <ul className="space-y-2">
                  {keyStrengths && keyStrengths.length > 0 ? (
                    keyStrengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">No key strengths identified</li>
                  )}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium flex items-center gap-2 mb-3">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Improvements
                </h3>
                <ul className="space-y-2">
                  {improvements && improvements.length > 0 ? (
                    improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{improvement}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-muted-foreground">No improvements suggested</li>
                  )}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="details">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Detailed Feedback</h3>
                <div className="bg-muted p-4 rounded-md whitespace-pre-line">
                  {detailedFeedback || "No detailed feedback available for this analysis type."}
                </div>

                {skillsAnalysis && Object.keys(skillsAnalysis).length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Skills Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(skillsAnalysis).map(([skill, rating]) => (
                        <div key={skill} className="flex justify-between items-center p-3 border rounded-md">
                          <span>{skill}</span>
                          <Badge variant={rating >= 3 ? "success" : "outline"}>{rating}/5</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="keywords">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Keyword Matching</h3>
                {keywordMatch && keywordMatch.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {keywordMatch.map((keyword, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded-md">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{keyword}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No keyword matching data available. Try providing a job description for better results.
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={() => setResult(null)}>
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

