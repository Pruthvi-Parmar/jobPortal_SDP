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

        setLoading(true);

        try {
            let requestBody = {
                jobDescription,
                analysisOption,
            };

            if (resume) {
                // Convert file to Base64 to send it in JSON format
                const fileBase64 = await convertFileToBase64(resume);
                requestBody.resume = fileBase64;
            } else {
                requestBody.resumeUrl = resumeUrl;
            }

            // ✅ Log JSON payload before sending
            console.log("Sending JSON:", requestBody);

            const response = await fetch("http://localhost:8001/v1/resume/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json(); // Ensure parsing response
            if (response.ok) {
                setResult(data);
            } else {
                setResult({ error: data.error || "An error occurred" });
            }
        } catch (error) {
            setResult({ error: error.message });
        } finally {
            setLoading(false);
        }
    };

    // Helper function to convert file to Base64
    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]); // Remove Data URL prefix
            reader.onerror = (error) => reject(error);
        });
    };



    return (
        <Card className="max-w-3xl mx-auto p-8 shadow-lg rounded-lg mt-10">

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

            {result && result.analysis && (
                <div className="mt-6 p-6 bg-white rounded-lg shadow-md border">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">📄 Resume Analysis</h2>
                    {console.log(result.analysis)}
                    {/* Best Matching Profession */}
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">👨‍💻 Best-Matching Profession:</h3>
                        <p className="text-gray-600">{result.analysis.match(/(?<=\*\*Best-Matching Profession:\*\* )(.*)/)?.[0]}</p>
                    </div>

                    {/* Key Strengths */}
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">✅ Key Strengths:</h3>
                        <ul className="list-disc list-inside text-gray-600">
                            {result.analysis.match(/(?<=\*\*3 Key Strengths:\*\*\n\n)([\s\S]*?)(?=\*\*2 Quick Improvements)/)?.[0]
                                .split("\n")
                                .filter((line) => line.trim().startsWith("1.") || line.trim().startsWith("2.") || line.trim().startsWith("3."))
                                .map((item, index) => (
                                    <li key={index} className="mt-1">{item.replace(/^\d+\.\s\*\*/, "").replace(/\*\*/, "")}</li>
                                ))}
                        </ul>
                    </div>

                    {/* Quick Improvements */}
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">🚀 Quick Improvements:</h3>
                        <ul className="list-disc list-inside text-gray-600">
                            {result.analysis.match(/(?<=\*\*2 Quick Improvements:\*\*\n\n)([\s\S]*?)(?=\*\*ATS Score)/)?.[0]
                                .split("\n")
                                .filter((line) => line.trim().startsWith("1.") || line.trim().startsWith("2."))
                                .map((item, index) => (
                                    <li key={index} className="mt-1">{item.replace(/^\d+\.\s\*\*/, "").replace(/\*\*/, "")}</li>
                                ))}
                        </ul>
                    </div>

                    {/* ATS Score */}
                    <div className="text-lg font-semibold text-gray-800">
                        📊 ATS Score:{" "}
                        <span className="text-blue-600">
                            {result.analysis
                                .split("ATS Score (out of 100):")[1] // Splits at "ATS Score (out of 100):"
                                ?.trim() // Removes extra spaces
                                .split("\n")[0]} {/* Gets the first line after split */}
                        </span>/100
                    </div>

                </div>
            )}

        </Card>
    );
};

export default ATS;
