import User from "../schemas/user.schema.js";
import cookie from "../utils/cookie.js";

async function isAuthenticated(req, res, next) {
    try {
        const token = req.cookies?.ACCESS_TOKEN;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided"
            });
        }
        
        try {
            const decoded = await cookie.decryptCookie(token);
            if (!decoded || !decoded.id) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: Invalid token payload"
                });
            }

            const user = await User.findById(decoded.id).select("-password");
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: User not found"
                });
            }

            req.user = user;
            next();
        }
        catch (e) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Token expired or invalid"
            });
        }
    }
    catch (e) {
        console.error("isAuthenticated ERROR:", e);
        return res.status(500).json({
            success: false,
            message: "Internal server error during authentication"
        });
    }
}

export { isAuthenticated };