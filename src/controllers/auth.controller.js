import User from "../schemas/user.schema.js"
import cookie from "../utils/cookie.js"
class Auth {

    async register(req, res) {
        const { name, email, password } = req.body 
        if (!name || name === "") {
            return res.status(500).json({
                success: false,
                message: "Name missing"
            })
        }
        if (!email || email === "") {
            return res.status(500).json({
                success: false,
                message: "Email missing"
            })
        }
        if (!password || password === "") {
            return res.status(500).json({
                success: false,
                message: "Password missing"
            })
        }

        try {
            const duplicateUser = await User.findOne({ email })
            if (duplicateUser) {
                return res.status(500).json({
                    success: false,
                    message: "Email already in use"
                })
            }

            const user = await User.create({ name, email, password });
            const token = await cookie.generateCookie({
                id: user._id
            });
            const userData = user.toObject;
            delete userData.password;
            res.cookie("ACCESS_TOKEN", token, cookie.cookieOptions);
            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                body : userData
            })

        } catch (e) {
            console.log(e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while registering"
            })
        }
    }

    async login(req, res) {
        const { email, password } = req.body

        if (!email || email === "") {
            return res.status(500).json({
                success: false,
                message: "Email is required"
            })
        }
        if (!password || password === "") {
            return res.status(500).json({
                success: false,
                message: "Password is required"
            })
        }

        try {

            const user = await User.findOne({ email })
            if (!user) {
                console.log( "User not found" );
                return res.status(500).json({
                    success: false,
                    message: "User not found"
                })
            }
            const isMatch = await user.matchPassword(password)
            if (!isMatch) {
                return res.status(500).json({
                    success: false,
                    message: "Invalid password"
                })
            }
            
            const token = await cookie.generateCookie({
                id: user._id
            });
            res.cookie("ACCESS_TOKEN", token, cookie.cookieOptions);
            return res.status(200).json({
                success: true,
                message: "User logged in successfully",
                body: {
                    _id: user._id,
                    name: user.name,
                    email: user.email
                }
            })

        } catch (e) {
            console.log(e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while logging in"
            })
        }
    }

    async current(req, res) {
        try {
            const user = req.user;

            if (!user) {
                return res.status(500).json({
                    success: false,
                    message: "User not found"
                })
            }

            return res.status(200).json({
                success: true,
                body: user
            })
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while getting current user"
            })
        }
    }

    async logout(req, res) {
        try {
            res.clearCookie("ACCESS_TOKEN");
            return res.status(200).json({
                success: true,
                message: "User logged out successfully"
            })
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while logging out"
            })
        }
    }

    async update( req, res ) {
        const user = req.user._id;
        const { name } = req.body;
        if( !name || name.trim() === "" ) {
            return res.status( 500 ).json( {
                success: false,
                message: "Name required"
            })
        }

        await User.findByIdAndUpdate( user, { name } );
        return res.status( 200 ).json( {
            success: true,
            message: "User details updated successfully"
        })
    }
}

export default new Auth()