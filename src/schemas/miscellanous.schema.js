import mongoose from "mongoose";

const miscellaneousSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Item name is required"],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const Miscellaneous = mongoose.model("Miscellaneous", miscellaneousSchema)
export default Miscellaneous