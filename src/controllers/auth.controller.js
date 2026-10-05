import User from "../schemas/user.schema.js";
import cookie from "../utils/cookie.js";

class Auth {
    async register(req, res) {
        const { name, email, password } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Name is required"
            });
        }
        if (!email || email.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        try {
            const duplicateUser = await User.findOne({ email: email.trim().toLowerCase() });
            if (duplicateUser) {
                return res.status(409).json({
                    success: false,
                    message: "Email already in use"
                });
            }

            const user = await User.create({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password
            });
            const token = await cookie.generateCookie({ id: user._id });
            const userData = user.toObject();
            delete userData.password;

            res.cookie("ACCESS_TOKEN", token, cookie.cookieOptions);
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                body: userData,
                user: userData // for frontend compatibility
            });
        } catch (e) {
            console.error("Register Error:", e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while registering"
            });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;

        if (!email || email.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }
        if (!password || password === "") {
            return res.status(400).json({
                success: false,
                message: "Password is required"
            });
        }

        try {
            const user = await User.findOne({ email: email.trim().toLowerCase() });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }
            
            const token = await cookie.generateCookie({ id: user._id });
            res.cookie("ACCESS_TOKEN", token, cookie.cookieOptions);
            return res.status(200).json({
                success: true,
                message: "User logged in successfully",
                body: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                },
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (e) {
            console.error("Login Error:", e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while logging in"
            });
        }
    }

    async current(req, res) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not authenticated"
                });
            }

            return res.status(200).json({
                success: true,
                body: user,
                user: user
            });
        } catch (e) {
            console.error("Current User Error:", e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while getting current user"
            });
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie("ACCESS_TOKEN", cookie.cookieOptions);
            return res.status(200).json({
                success: true,
                message: "User logged out successfully"
            });
        } catch (e) {
            console.error("Logout Error:", e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while logging out"
            });
        }
    }

    async update(req, res) {
        try {
            const userId = req.user._id;
            const { name } = req.body;
            if (!name || name.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Name is required"
                });
            }

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { name: name.trim() },
                { new: true }
            ).select("-password");

            return res.status(200).json({
                success: true,
                message: "User details updated successfully",
                body: updatedUser,
                user: updatedUser
            });
        } catch (e) {
            console.error("Update Error:", e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while updating"
            });
        }
    }
}

export default new Auth();