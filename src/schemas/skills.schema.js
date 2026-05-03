import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const Skill = mongoose.model("Skill", skillSchema)
export default Skill
