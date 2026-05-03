import jwt from "jsonwebtoken";

class Cookie {
    cookieOptions;
    constructor() {
        const isDev = process.env.STATUS === "DEV";
        this.cookieOptions = isDev ?
            {
                maxAge: 10 * 60 * 60 * 24,
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            } :
            {
                maxAge: 10 * 60 * 60 * 24,
                httpOnly: false,
                secure: false,
                sameSite: "lax"
            }
    }
    async generateCookie(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10d" })
    }

    async decryptCookie(token) {
        return jwt.verify(token, process.env.JWT_SECRET)
    }
}

export default new Cookie()
