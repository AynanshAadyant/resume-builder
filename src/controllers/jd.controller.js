import Jd from "../schemas/jd.schema.js";
import AI from "../services/ai.service.js";

class JDController {
    async store(req, res) {
        const user = req.user;
        const { JD } = req.body;
        try {
            if (!JD || JD.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Job description is required"
                });
            }

            // Tenant-scoped deduplication
            const existingJD = await Jd.findOne({ rawText: JD.trim(), user: user._id });
            if (existingJD) {
                return res.status(200).json({
                    success: true,
                    message: "JD already exists",
                    data: existingJD._id
                });
            }

            const newJD = await Jd.create({
                rawText: JD.trim(),
                user: user._id
            });
            return res.status(201).json({
                success: true,
                message: "JD stored successfully",
                data: newJD._id
            });
        } catch (err) {
            console.error("ERROR while storing JD:", err);
            return res.status(500).json({
                success: false,
                message: "Internal server error while storing JD"
            });
        }
    }

    async parse(req, res) {
        const user = req.user;
        const JDId = req.params.id;
        try {
            const jd = await Jd.findOne({ _id: JDId, user: user._id });
            if (!jd) {
                return res.status(404).json({
                    success: false,
                    message: "JD not found"
                });
            }
            if (jd.parsedText && Object.keys(jd.parsedText).length > 0) {
                return res.status(200).json({
                    success: true,
                    message: "Parsed Data already exists",
                    data: jd.parsedText
                });
            }
            const parsedJD = await AI.parseJD(jd.rawText);
            if (!parsedJD || !parsedJD.valid || parsedJD.valid === 'false') {
                await Jd.findOneAndDelete({ _id: JDId, user: user._id });
                return res.status(400).json({
                    success: false,
                    message: "Invalid or unparseable Job Description"
                });
            }
            jd.parsedText = parsedJD.jd;
            await jd.save();
            return res.status(200).json({
                success: true,
                message: "JD parsed successfully",
                data: jd.parsedText
            });
        } catch (err) {
            console.error("ERROR while parsing JD:", err);
            return res.status(500).json({
                success: false,
                message: "Internal server error while parsing JD"
            });
        }
    }

    async get(req, res) {
        const user = req.user;
        const JDId = req.params.id;
        try {
            const jd = await Jd.findOne({ _id: JDId, user: user._id });
            if (!jd) {
                return res.status(404).json({
                    success: false,
                    message: "JD not found"
                });
            }

            return res.status(200).json({
                success: true,
                message: "JD fetched successfully",
                data: jd
            });
        } catch (e) {
            console.error("ERROR while fetching JD:", e);
            return res.status(500).json({
                success: false,
                message: "Internal server error while fetching JD"
            });
        }
    }

    async delete(req, res) {
        const user = req.user;
        const JDId = req.params?.id;
        try {
            if (!JDId) {
                return res.status(400).json({
                    success: false,
                    message: "JD id missing"
                });
            }
            const jd = await Jd.findOneAndDelete({ _id: JDId, user: user._id });
            if (!jd) {
                return res.status(404).json({
                    success: false,
                    message: "JD not found or unauthorized"
                });
            }

            return res.status(200).json({
                success: true,
                message: "JD deleted successfully"
            });
        } catch (e) {
            console.error("ERROR while deleting JD:", e);
            return res.status(500).json({
                success: false,
                message: "Internal server error while deleting JD"
            });
        }
    }

    async getAll(req, res) {
        const user = req.user;
        try {
            const jds = await Jd.find({ user: user._id }).sort({ createdAt: -1 });
            return res.status(200).json({
                success: true,
                message: "JDs fetched successfully",
                data: jds
            });
        } catch (e) {
            console.error("ERROR while fetching JDs:", e);
            return res.status(500).json({
                success: false,
                message: "Internal server error while fetching JDs"
            });
        }
    }
}

export default new JDController();