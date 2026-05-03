import mongoose from "mongoose";

const achievementsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Achievement title is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Achievement description is required"],
        trim: true
    },
    issue_date: {
        type: Date,
        required: [true, "Issue date is required"]
    },
    url: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const Achievement = mongoose.model("Achievement", achievementsSchema)
export default Achievement