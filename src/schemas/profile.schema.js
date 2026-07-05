import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    phoneNo: {
        type: String,
        required: [true, "Phone number is required"],
        unique: [true, "Phone number already exist"],
        trim: true
    },
    location: {
        type: String,
        required: [true, "Location is required"]
    },
    linkedIn: {
        type: String,
        trim: true
    },
    github: {
        type: String,
        trim: true
    },
    portfolio: {
        type: String,
        trim: true
    }
}, { timestamps: true })

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
