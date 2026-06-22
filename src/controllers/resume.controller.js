import Resume from "../schemas/resume.schema.js";
import Profile from "../schemas/profile.schema.js";
import JD from "../schemas/jd.schema.js";
import workExperience from "../schemas/work.schema.js";
import AI from "../services/ai.service.js";
import Project from "../schemas/projects.schema.js";
import Skill from "../schemas/skills.schema.js";
import Education from "../schemas/education.schema.js";
import Certification from "../schemas/certifications.schema.js";
import Achievement from "../schemas/achievements.schema.js";
import Miscellaneous from "../schemas/miscellanous.schema.js";
class ResumeController {
    constructor() { }

    async createResume(req, res) {
        try {
            const { profileID, jdID } = req.body; //profile ID 
            console.log( "Resume creating started" )
            if (!profileID) {
                console.log( "Missing profile id" )
                return res.status(400).json({
                    success: false,
                    message: "Profile ID is required"
                })
            }
            if (!jdID) {
                console.log("Missing JD id" )
                return res.status(500).json({
                    success: false,
                    message: "Invalid JD ID"
                })
            }
            const profile = await Profile.findById(profileID);
            if (!profile) {
                return res.status(404).json({
                    success: false,
                    message: "Profile not found"
                })
            }
            const jd = await JD.findById(jdID);
            if (!jd) {
                return res.status(404).json({
                    success: false,
                    message: "JD not found"
                })
            }
            const user = profile.user
            if (user != req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to create resume for this profile"
                })
            }
            const existingResume = await Resume.findOne({
                user: req.user._id,
                profile: profileID,
                jd : jdID
            })
            if ( existingResume) {
                return res.status(200).json({
                    success: true,
                    message: "Resume already exists for this profile",
                    resume : existingResume
                })
            }
            const workExp = await workExperience.find({ user: req.user.id })
            const projects = await Project.find({ user: req.user.id })
            const skills = await Skill.find({ user: req.user.id })
            const education = await Education.find({ user: req.user.id })
            const certifications = await Certification.find({ user: req.user.id })
            const achievements = await Achievement.find({ user: req.user.id })
            const miscellaneous = await Miscellaneous.find({ user: req.user.id })

            const data = {
                workExp,
                projects,
                skills,
                education,
                certifications,
                achievements,
                miscellaneous
            }
            const resumeData = await AI.generateResume(data, jd.parsedText);
            if (!resumeData || resumeData === null) {
                return res.status(500).json({
                    success: false,
                    mesaage: "Failed to process AI request"
                })
            }
            const newResume = await Resume.insertOne({
                user,
                profile: profileID,
                jd : jdID,
                workExp : resumeData.workExp || [],
                projects : resumeData.projects || [],
                skills : resumeData.skills || [],
                education : resumeData.education|| [],
                certifications : resumeData.certifications || [],
                achievements : resumeData.achievements || [],
                extra: resumeData.extra || [],
                company: jd.parsedText.metadata.company || "",
                title: jd.parsedText.metadata.jobTitle || "",
                role: jd.parsedText.metadata.jobTitle || "",
                ats : resumeData.ats || 0
            })
            console.log( "Resume stored" );
            return res.status(201).json({
                success: true,
                message: "Resume created successfully",
                resume: newResume
            })
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while creating resume"
            })
        }
    }

    async createResumeFromPrompt(req, res) {
        try {
            const { profileID, prompt } = req.body; //profile ID 
            if (!profileID) {
                return res.status(400).json({
                    success: false,
                    message: "Profile ID is required"
                })
            }
            if( !prompt ) {
                return res.status( 400 ).json( {
                    success: false,
                    message: "Prompt required"
                })
            }

            const profile = await Profile.findById(profileID);
            if (!profile) {
                return res.status(404).json({
                    success: false,
                    message: "Profile not found"
                })
            }

            const user = profile.user
            if (user != req.user._id) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to create resume for this profile"
                })
            }

            const existingResume = await Resume.findOne({
                user: req.user._id,
                profile: profileID,
                prompt
            })
            if (existingResume) {
                return res.status(400).json({
                    success: false,
                    message: "Resume already exists for this prompt",
                    body: existingResume
                })
            }

            const workExp = await workExperience.find({ user: req.user._id })
            const projects = await Project.find({ user: req.user._id })
            const skills = await Skill.find({ user: req.user._id })
            const education = await Education.find({ user: req.user._id })
            const certifications = await Certification.find({ user: req.user._id })
            const achievements = await Achievement.find({ user: req.user._id })
            const miscellaneous = await Miscellaneous.find({ user: req.user._id })

            const data = {
                workExp,
                projects,
                skills,
                education,
                certifications,
                achievements,
                miscellaneous
            }

            const resumeData = await AI.generateResumeFromPrompt(data, prompt);
            if (!resumeData || resumeData === null) {
                return res.status(500).json({
                    success: false,
                    mesaage: "Failed to process AI request"
                })
            }

            const newResume = await Resume.insert({
                user,
                profile: profileID,
                jd : jdID,
                workExp : resumeData.workExp || [],
                projects : resumeData.projects || [],
                skills : resumeData.skills || [],
                education : resumeData.education|| [],
                certifications : resumeData.certifications || [],
                achievements : resumeData.achievements || [],
                extra: resumeData.extra || [],
                company: jd.parsedText.metadata.company || "",
                title: jd.parsedText.metadata.jobTitle || "",
                role: jd.parsedText.metadata.jobTitle || "",
                ats : resumeData.ats || 0
            })

            return res.status(201).json({
                success: true,
                message: "Resume created successfully",
                resume: newResume
            })
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while creating resume"
            })
        }
    }

    async getResume(req, res) { //fetches all resumes in database, admin permission
        try {
            const resumes = await Resume.find();
            if (!resume) {
                return res.status(404).json({
                    success: false,
                    message: "Resume not found"
                })
            }
            return res.status(200).json({
                success: true,
                message: "Resumes fetched successfully",
                resumes
            })
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching resume"
            })
        }
    }

    async getUserResumes(req, res) {
        try {
            const resumes = await Resume.find({ user: req.user._id })
            return res.status(200).json({
                success: true,
                message: "Resumes fetched successfully",
                resumes
            })
        }
        catch (e) {
            console.log(e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching resumes"
            })
        }
    }

    async getResumeById( req, res ) {
        try{
            const {id} = req.params;
            const user_id = req.user._id;
            
            if( !id ) {
                console.log("Invalid ID or ID missing to fetch resume" );
                return res.status( 400 ).json( {
                    success: false,
                    message: "ID Invalid or missing"
                })
            }

            const resume = await Resume.findOne( { _id : id, user : user_id});
            if( !resume ) {
                console.log( "Missing resume or unauthorised access" );
                return res.status( 404 ).json( {
                    success: false,
                    message: "Resume not found or not authorised"
                })
            }

            return res.status( 200 ).json( {
                success: true,
                message: "Resume fetched successfully",
                resume
            })

        }
        catch( e ) {
            console.log( e );
            return res.status( 500 ).json( {
                success: false,
                message: "Something went wrong while fetching resume" || e?.message
            })
        }
    }

    async deleteResume(req, res) {
        try {
            const { id } = req.params;
            const resume = await Resume.findOne({ _id: id, user: req.user._id });
            if (!resume) {
                return res.status(404).json({
                    success: false,
                    message: "Resume not found"
                });
            }
            await Resume.findByIdAndDelete(id);
            return res.status(200).json({
                success: true,
                message: "Resume deleted successfully"
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while deleting resume"
            });
        }
    }

}

export default new ResumeController();
