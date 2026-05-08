import Resume from "../schemas/resume.schema.js";
import Profile from "../schemas/profile.schema.js";
import JD from "../schemas/jd.schema.js";
import workExperience from "../schemas/work.schema.js";
import AI from "../services/ai.service.js";
class ResumeController {
    constructor() { }

    async createResume(req, res) {
        try {
            const { profileID, jdID } = req.body; //profile ID 
            if (!profileID) {
                return res.status(400).json({
                    success: false,
                    message: "Profile ID is required"
                })
            }
            if (!jdID) {
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
                user: req.user.id,
                profile: profileID
            })
            if (existingResume) {
                return res.status(400).json({
                    success: false,
                    message: "Resume already exists for this profile"
                })
            }

            const workExp = await workExperience.findAll({ user: req.user.id })
            const projects = await Project.findAll({ user: req.user.id })
            const skills = await Skill.findAll({ user: req.user.id })
            const education = await Education.findAll({ user: req.user.id })
            const certifications = await Certification.findAll({ user: req.user.id })
            const achievements = await Achievement.findAll({ user: req.user.id })
            const miscellaneous = await Miscellaneous.findAll({ user: req.user.id })

            const data = {
                workExp,
                projects,
                skills,
                education,
                certifications,
                achievements,
                miscellaneous
            }

            const resumeData = await AI.generateResume(data, jd);
            if (!resumeData || resumeData === null) {
                return res.status(500).json({
                    success: false,
                    mesaage: "Failed to process AI request"
                })
            }

            const newResume = await Resume.create({
                user,
                profile: profileID,
                ...resumeData
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

    async getResume(req, res) {
        try {
            const { id } = req.params;
            const resume = await Resume.findById(id);
            if (!resume) {
                return res.status(404).json({
                    success: false,
                    message: "Resume not found"
                })
            }
            if (resume.user != req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to fetch this resume"
                })
            }
            return res.status(200).json({
                success: true,
                message: "Resume fetched successfully",
                resume
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
            const resumes = await Resume.find({ user: req.user.id });
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

}

export default new ResumeController();
