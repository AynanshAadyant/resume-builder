import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { syncIndexes } from "mongoose";
import { jd_parse_prompt } from "./prompts";
import { response } from "express";

dotenv.config({ override: true });

class AI {
    genai;
    constructor() {
        this.genai = new GoogleGenerativeAI(process.env.AI_API_KEY);
    }

    async parseJD(jd) {
        try {
            const response = await this.genai.models.generateContent({
                model: "gemini-2.5-flash-lite",
                contents: jd,
                config: {
                    systemInstruction: jd_parse_prompt,
                    responseMimeType: "application/json"
                }
            })

            const jsonText = response.response.text();
            return JSON.parse(jsonText);
        }
        catch (e) {
            console.log("AI error: ", e);
            return null;
        }
    }

}