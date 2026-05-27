import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { jd_parse_prompt, resume_generate_prompt, custom_resume_generate_prompt } from "./prompts.js";

dotenv.config({ path: "../../.env", override: true });

class AI {
    genai;
    constructor() {
        this.genai = new GoogleGenAI({});
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

    async generateResume(user,jd) {
        try {
            const response = await this.genai.models.generateContent({
                model: "gemini-2.5-flash-lite",
                contents: `USER DATA: ${JSON.stringify(user)}\n\nJOB DESCRIPTION: ${JSON.stringify(jd)}`,
                config: {
                    systemInstruction: resume_generate_prompt,
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

    async generateResumeFromPrompt( user, prompt) {
        try {
            const response = await this.genai.models.generateContent({
                model: "gemini-2.5-flash-lite",
                contents: `USER DATA: ${JSON.stringify(user)}\n\nJOB DESCRIPTION: ${JSON.stringify(jd)}`,
                config: {
                    systemInstruction: custom_resume_generate_prompt,
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

    async testConnection() {
        const response = await this.genai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: "Say Hi to me",
        })

        return response;
    }

}

export default new AI()

