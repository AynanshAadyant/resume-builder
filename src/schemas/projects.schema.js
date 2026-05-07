import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Project title is required"],
        trim: true
    },
    tech_stack: {
        type: [String],
        required: [true, "Tech stack is required"]
    },
    description: {
        type: String,
        required: [true, "Project description is required"],
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
    features: {
        type: String,
        required: true,
    },
    github_link: {
        type: String
    },
    live_link: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const Project = mongoose.model("Project", projectSchema);
export default Project
