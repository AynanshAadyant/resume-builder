import User from "../schemas/user.schema.js";
import cookie from "../utils/cookie.js";

function isAuthenticated(req, res, next) {
    try {
        const token = req.cookies?.ACCESS_TOKEN;
        if (!token) {
            return res.status(500).json({
                success: false,
                message: "Unauthorised"
            })
        }

        try {
            const decoded = cookie.decryptCookie(token);
            if (!decoded) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid token payload"
                })
            }

            const user = User.findById(decoded.id).select("-password");
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                })
            }

            req.user = user;
            next();
        }
        catch (e) {
            return res.status(500).json({
                success: false,
                message: "Invalid token"
            })
        }
    }
    catch (e) {
        console.log("isAuthenticated ERROR :\n", e);

        return res.status(500).json({
            success: false,
            message: "Something went wrong while authentication"
        })
    }
}

export { isAuthenticated }