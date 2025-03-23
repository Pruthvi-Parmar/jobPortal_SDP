import { extractTextFromPDF } from "../utils/pdfParser.js";
import { getGeminiOutput } from "../utils/aiConfig.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const analyzeResume = async (req, res) => {
  try {
    // Validate uploaded file or resume URL
    console.log(req.body.resumeUrl);
    if (!req.files?.resume && !req.body.resumeUrl) {
      return res.status(400).json({ error: "No resume file or URL provided" });
    }
    console.log("first point");
    let pdfText = "";

    if (req.files?.resume) {
      const uploadedFile = req.files.resume;
      if (!uploadedFile.name.endsWith(".pdf")) {
        return res.status(400).json({ error: "Only PDF files are allowed" });
      }
      const uint8Array = new Uint8Array(uploadedFile.data);
      pdfText = await extractTextFromPDF(uint8Array);
    } else {
      // If a URL is provided, fetch the PDF
      console.log("running til now in analyse controller");
      const response = await fetch(req.body.resumeUrl);
      if (!response.ok) {
        console.log("issue with cloudinary");
        return res.status(400).json({ error: "Invalid resume URL" });
      }
      const pdfBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(pdfBuffer);
      pdfText = await extractTextFromPDF(uint8Array);
    }

    // Get job description and analysis option
    const jobDescription = req.body.jobDescription || "";
    const analysisOption = req.body.analysisOption || "Quick Scan";
    // Generate the AI prompt
    let prompt;
    switch (analysisOption) {
      case "Quick Scan":
        prompt = `
          Provide a quick scan of this resume:
          - Identify the best-matching profession.
          - List 3 key strengths.
          - Suggest 2 quick improvements.
          - Provide an ATS score out of 100.
          
          Resume text: ${pdfText}
          Job description (if provided): ${jobDescription}
        `;
        break;
      case "Detailed Analysis":
        prompt = `
          Provide a detailed resume analysis:
          - Identify the best-matching profession.
          - List 5 strengths.
          - Suggest 3-5 improvements.
          - Rate Impact, Brevity, Style, Structure, Skills (out of 10).
          - Give an overall ATS score out of 100.
          
          Resume text: ${pdfText}
          Job description (if provided): ${jobDescription}
        `;
        break;
      case "ATS Optimization":
        prompt = `
          Optimize this resume for ATS:
          - Identify missing keywords from the job description.
          - Suggest improvements for readability.
          - Recommend 3-5 optimization points.
          - Give an ATS compatibility score.
          
          Resume text: ${pdfText}
          Job description: ${jobDescription}
        `;
        break;
      default:
        return res.status(400).json({ error: "Invalid analysis option" });
    }

    // Get AI response
    const responseText = await getGeminiOutput(prompt);
    // console.log("RESPONSE TEXT OF ANALYSIS",responseText);
    console.log("res : ", responseText);

    

    // In your analyzeResume function, replace the return statement with:
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          analysis: responseText,
        },
        "Analysis successful"
      )
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error during resume analysis" });
  }
};
