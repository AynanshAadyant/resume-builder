import mongoose from "mongoose";

const workSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, "Company name is required"],
        trim: true
    },
    position: {
        type: String,
        required: [true, "Position is required"],
        trim: true
    },
    location: {
        type: String,
        required: [true, "Location is required"],
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, "Start date is required"]
    },
    endDate: {
        type: Date,
        required: [true, "End date is required"]
    },
    type: {
        type: String,
        enum: ["full-time", "part-time", "contract", "internship", "freelance", "other"],
        required: true,
        trim: true
    },
    responsibilities: {
            type: String,
            required: [true, "Responsibility is required"],
            trim: true
        },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, { timestamps: true })

const workExperience = mongoose.model("WorkExperience", workSchema);
export default workExperience