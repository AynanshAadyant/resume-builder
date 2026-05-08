import mongoose from "mongoose"

const educationSchema = new mongoose.Schema({
    degree: {
        type: String,
        required: [true, "Degree is required"],
        trim: true
    },
    fieldOfStudy: {
        type: String,
        required: [true, "Field of study is required"]
    },
    institution: {
        type: String,
        required: [true, "Institution name is required"],
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
    cgpa: {
        type: Number,
        required: [true, "CGPA is required"],
        trim: true
    },
    content: {
        type: String,
        default: ""
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })


const Education = mongoose.model("Education", educationSchema);
export default Education