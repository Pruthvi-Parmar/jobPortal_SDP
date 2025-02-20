import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const chatbot = asyncHandler(async (req, res) => {
    const { userQuery } = req.body;
    console.log(req.body);

    const api_key = "SG_b2eef1726812b277";  // Ensure this is valid
    const url = "https://api.segmind.com/v1/llama-v3-8b-instruct";

    // Predefined topics
    const allowedTopics = [
        "job", "application", "resume", "cover letter", "interview",
        "vacancy", "computer science roles", "tech industry",
        "skills", "salary", "job portal", "hiring process", "react"
    ];

    // Check if the query is relevant
    if (!allowedTopics.some(topic => userQuery.toLowerCase().includes(topic))) {
        return res.status(400).json(new ApiError(400, "I can only assist with queries related to the job portal."));
    }

    const data = JSON.stringify({
        "messages": [
            {
                "role": "user",
                "content": userQuery
            }
        ]
    });

    try {
        console.log("Before API call");

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "x-api-key": api_key,
                "Content-Type": "application/json",
                "Accept": "application/json"  // 👈 Added Accept header
            },
            body: data
        });

        console.log("After API call");

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Response:", errorText);
            throw new Error(`API responded with status ${response.status}: ${errorText}`);
        }

        const responseData = await response.json();
        const chatbotReply = responseData?.choices?.[0]?.message?.content || "No response received";

        //console.log("Chatbot Reply:", chatbotReply);
        return res.status(200).json(new ApiResponse(200, chatbotReply, "Query successful"));
    } catch (error) {
        console.error("API Call Error:", error);
        return res.status(500).json(new ApiError(500, "Something went wrong: " + error.message));
    }
});

export { chatbot };
