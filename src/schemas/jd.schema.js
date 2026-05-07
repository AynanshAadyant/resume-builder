import mongoose from "mongoose";

const JD = new mongoose.Schema(
    {
        rawText: {
            type: String,
            default: "",
            unique: true,
            trim: true,
        },
        parsedText: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

const Jd = mongoose.model("JD", JD);

export default Jd;