import { Mistral } from '@mistralai/mistralai';
import dotenv from "dotenv";
import { jd_parse_prompt, resume_generate_prompt, custom_resume_generate_prompt } from "./prompts.js";

dotenv.config({ override: true });

class AI {
    client;
    constructor() {
        this.client = new Mistral({apiKey : process.env.MISTRAL_API_KEY});
    }

    async parseJD(jd) {
        try {
            const response = await this.client.chat.complete({
                model: "mistral-small-2603",
                messages: [
                    {
                        role: "system", content: jd_parse_prompt
                    },
                    {
                        role: "user", content: jd
                    }
                ]
            })

            const content = response.choices?.[0]?.message?.content;

            if (typeof content !== "string") {
                return content;
            }

            try {
                return JSON.parse(content);
            } catch (parseError) {
                console.error("Failed to parse AI response:", content);
                return null;
            }

        }
        catch (e) {
            console.log("AI error: ", e);
            return null;
        }
    }

    async generateResume(user,jd) {
        try {
            const response = await this.client.chat.complete({
                model: "mistral-small-2603",
                messages: [
                    {
                        role: "system", content: resume_generate_prompt
                    },
                    {
                        role: "user",
                        content: `USER DATA: ${JSON.stringify(user)}\n\nJOB DESCRIPTION: ${JSON.stringify(jd)}`
                    }
                ]
            })
            const content = response.choices?.[0]?.message?.content;
            if( typeof content !== "string" ) {
                return content;
            }
            try {
                return JSON.parse( content );
            }
            catch( e ) {
                console.log( "Failed to parse AI response", content );
                return null;
            }
        }
        catch (e) {
            console.log("AI error: ", e);
            return null;
        }
    }

    async generateResumeFromPrompt( user, prompt) {
        try {
            const response = await this.client.chat.complete({
                model: "mistral-small-2603",
                messages: [
                    {
                        role: "system", content: custom_resume_generate_prompt
                    },
                    {
                        role: "user",
                        content: `USER DATA: ${JSON.stringify(user)}\n\PROMPT: ${prompt}`
                    }
                ]
            })
            const content = response.choices?.[0]?.message?.content;
            if( typeof content !== "string" ) {
                return content;
            }
            try {
                return JSON.parse( content );
            }
            catch( e ) {
                console.log( "Failed to parse AI response", content );
                return null;
            }
        }
        catch (e) {
            console.log("AI error: ", e);
            return null;
        }
    }

    async testConnection() {
        try{
            const response = await this.client.chat.complete({
                model: "mistral-small-2603",
                messages: [
                    {
                        role: "user", content: "Say HI if you can listen to me"
                    }
                ]
            })
            const content = response?.choices?.[0]?.message?.content;

            return content;
        }
        catch(e) {
            console.log( "AI ERROR : ", e );
            return null;
        }
    }

}

export default new AI()

