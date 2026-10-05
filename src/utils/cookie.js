import jwt from "jsonwebtoken";

class Cookie {
    get cookieOptions() {
        const isDev = (process.env.STATUS || "DEV").toUpperCase() === "DEV";
        return {
            maxAge: 10 * 1000 * 60 * 60 * 24, // 10 days
            httpOnly: true, // Secure against XSS token theft
            secure: !isDev, // true in HTTPS prod, false in local dev HTTP
            sameSite: isDev ? "lax" : "none"
        };
    }
    async generateCookie(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10d" })
    }

    async decryptCookie(token) {
        return jwt.verify(token, process.env.JWT_SECRET)
    }
}

export default new Cookie()
