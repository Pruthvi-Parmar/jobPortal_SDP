import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Toast } from "@/components/ui/toast";

const ATS = () => {
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysisOption, setAnalysisOption] = useState("Quick Scan");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:8001/v1/users/getCurrentUser",
          {},
          { withCredentials: true }
        );

        const result = response.data;
        if (result.success) {
          const userData = result.data;
          setResumeUrl(userData.resume);
        } else {
          throw new Error(result.message || "Failed to fetch user data");
        }
      } catch (error) {
        Toast({ title: "Error", description: error.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
    setResumeUrl("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume && !resumeUrl) {
      Toast({ title: "Error", description: "Please upload a PDF file.", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    if (resume) {
      formData.append("resume", resume);
    } else {
      formData.append("resumeUrl", resumeUrl);
    }
    formData.append("jobDescription", jobDescription);
    formData.append("analysisOption", analysisOption);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setResult(result);
      } else {
        setResult({ error: response.statusText });
      }
    } catch (error) {
      setResult({ error: error.message });
    }

    setLoading(false);
  };

  return (
    <Card className="max-w-lg mx-auto p-6 shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">
        Resume Analysis
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-600">Upload Resume (PDF):</label>
          {resumeUrl && (
            <p className="mt-2 text-blue-500">Existing Resume: <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="underline">View Resume</a></p>
          )}
          <Input type="file" accept=".pdf" onChange={handleFileChange} className="mt-2" />
        </div>

        <div>
          <label className="block font-medium text-gray-600">Job Description (optional):</label>
          <Textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows="4" className="mt-2" />
        </div>

        <div>
          <label className="block font-medium text-gray-600">Select Analysis Type:</label>
          <Select value={analysisOption} onValueChange={setAnalysisOption}>
            <SelectTrigger>
              <SelectValue placeholder="Select analysis type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Quick Scan">Quick Scan</SelectItem>
              <SelectItem value="Detailed Analysis">Detailed Analysis</SelectItem>
              <SelectItem value="ATS Optimization">ATS Optimization</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze Resume"}
        </Button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold text-gray-700">Analysis Result:</h2>
          <pre className="mt-2 text-sm text-gray-800 overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </Card>
  );
};

export default ATS;
