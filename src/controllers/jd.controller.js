import Jd from "../schemas/jd.schema.js";
import AI from "../services/ai.service.js";

class JD {
    constructor() { }

    async store(req, res) {
        const user = req.user;
        const { JD } = req.body;
        console.log("Storing JD" );
        try {
            if (!JD || JD.trim() === "") {
                return res.status(401).json({
                    success: false,
                    message: "JD required"
                })
            }

            const existingJD = await Jd.findOne({ rawText: JD })

            if (existingJD) {
                return res.status(200).json({
                    success: true,
                    message: "JD already exists",
                    data: existingJD._id
                })
            }

            const newJD = await Jd.create({
                rawText: JD,
                user
            });
            console.log( "JD stored" );
            return res.status(201).json({
                success: true,
                message: "JD stored successfully",
                data: newJD._id
            })
        } catch (err) {
            console.log("ERROR while storing JD : ", err);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            })
        }
    }

    async parse(req, res) {
        const user = req.user;
        const JDId = req.params.id;
        console.log("Parsing JD" );
        try {
            const jd = await Jd.findOne({ _id: JDId, user });
            if (!jd) {
                return res.status(404).json({
                    success: false,
                    message: "JD not found"
                })
            }
            if( jd.parsedText &&
    Object.keys(jd.parsedText).length > 0 ) {
                console.log("Parsed Data already exists" );
                return res.status( 200 ).json( {
                    success: true,
                    message: "Parsed Data already exists",
                    data: jd.parsedText
                })
            }
            const parsedJD = await AI.parseJD(jd.rawText);
            //checks if valid JD, if gibberish then false
            if( !parsedJD.valid || parsedJD.valid === 'false' ) {
                await Jd.findByIdAndDelete( JDId );
                return res.status( 200 ).json( {
                    success: false,
                    message: "Invalid JD"
                })
            }
            jd.parsedText = parsedJD.jd;
            await jd.save();
            console.log("Parsed JD" );
            return res.status(200).json({
                success: true,
                message: "JD parsed successfully",
                data: jd.parsedText
            })
        } catch (err) {
            console.log("ERROR while parsing JD : ", err);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            })
        }
    }

    async get(req, res) {
        const user = req.user;
        const JDId = req.params.id;
        try {
            const jd = await Jd.findOne({ _id: JDId, user });
            if (!jd) {
                return res.status(404).json({
                    success: false,
                    message: "JD not found"
                })
            }

            return res.status(200).json({
                success: true,
                message: "JD fetched successfully",
                data: jd
            })
        }
        catch (e) {
            console.log("ERROR while fetching JD : ", e);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            })
        }
    }

    async delete(req, res) {
        const user = req.user;
        const JDId = req.params?.id;
        try {
            if( !JDId ) {
                return res.status( 400 ).json( {
                    success: false,
                    message: "JD id missing"
                })
            }
            const jd = await JD.findByIdAndDelete( JDId );
            if( !jd ) {
                return res.status( 500 ).json( {
                    success: false,
                    message: "Cannot delete JD"
                })
            }

            return res.status(200).json({
                success: true,
                message: "JD deleted successfully"
            })
        }
        catch (e) {
            console.log("ERROR while deleting JD : ", e);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            })
        }
    }

    async getAll(req, res) {
        const user = req.user;
        try {
            const jds = await Jd.find({ user });
            return res.status(200).json({
                success: true,
                message: "JDs fetched successfully",
                data: jds
            });
        } catch (e) {
            console.log("ERROR while fetching JDs : ", e);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
}

export default new JD();