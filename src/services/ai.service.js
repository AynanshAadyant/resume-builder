import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { jd_parse_prompt } from "./prompts.js";

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

    async testConnection() {
        const response = await this.genai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: "Say Hi to me",
        })

        return response;
    }

}

export default new AI()

