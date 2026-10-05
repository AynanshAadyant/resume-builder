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
    async createResume(req, res) {
        try {
            const { profileID, jdID } = req.body;
            if (!profileID) {
                return res.status(400).json({
                    success: false,
                    message: "Profile ID is required"
                });
            }
            if (!jdID) {
                return res.status(400).json({
                    success: false,
                    message: "Job Description ID is required"
                });
            }

            const profile = await Profile.findById(profileID);
            if (!profile) {
                return res.status(404).json({
                    success: false,
                    message: "Profile not found"
                });
            }

            if (profile.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to create resume for this profile"
                });
            }

            const jd = await JD.findOne({ _id: jdID, user: req.user._id });
            if (!jd) {
                return res.status(404).json({
                    success: false,
                    message: "Job Description not found or unauthorized"
                });
            }

            // Fetch profile auxiliary collections in parallel
            const [
                workExp,
                projects,
                skills,
                education,
                certifications,
                achievements,
                miscellaneous
            ] = await Promise.all([
                workExperience.find({ user: req.user._id }),
                Project.find({ user: req.user._id }),
                Skill.find({ user: req.user._id }),
                Education.find({ user: req.user._id }),
                Certification.find({ user: req.user._id }),
                Achievement.find({ user: req.user._id }),
                Miscellaneous.find({ user: req.user._id })
            ]);

            const data = {
                workExp,
                projects,
                skills,
                education,
                certifications,
                achievements,
                miscellaneous
            };

            const resumeData = await AI.generateResume(data, jd.parsedText);
            if (!resumeData) {
                return res.status(502).json({
                    success: false,
                    message: "Failed to process AI resume generation request"
                });
            }

            const newResume = await Resume.create({
                user: req.user._id,
                profile: profileID,
                jd: jdID,
                workExp: resumeData.workExp || [],
                projects: resumeData.projects || [],
                skills: resumeData.skills || [],
                education: resumeData.education || [],
                certifications: resumeData.certifications || [],
                achievements: resumeData.achievements || [],
                extra: resumeData.extra || [],
                company: resumeData.company || jd.parsedText?.metadata?.company || "",
                title: resumeData.title || jd.parsedText?.metadata?.jobTitle || "Tailored Resume",
                role: resumeData.role || jd.parsedText?.metadata?.jobTitle || "",
                ats: resumeData.ats || 0
            });

            return res.status(201).json({
                success: true,
                message: "Resume created successfully",
                resume: newResume
            });
        } catch (e) {
            console.error("Error creating resume:", e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while creating resume"
            });
        }
    }

    async createResumeFromPrompt(req, res) {
        try {
            const { profileID, prompt } = req.body;
            if (!profileID) {
                return res.status(400).json({
                    success: false,
                    message: "Profile ID is required"
                });
            }
            if (!prompt || prompt.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Prompt is required"
                });
            }

            const profile = await Profile.findById(profileID);
            if (!profile) {
                return res.status(404).json({
                    success: false,
                    message: "Profile not found"
                });
            }

            if (profile.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to create resume for this profile"
                });
            }

            const [
                workExp,
                projects,
                skills,
                education,
                certifications,
                achievements,
                miscellaneous
            ] = await Promise.all([
                workExperience.find({ user: req.user._id }),
                Project.find({ user: req.user._id }),
                Skill.find({ user: req.user._id }),
                Education.find({ user: req.user._id }),
                Certification.find({ user: req.user._id }),
                Achievement.find({ user: req.user._id }),
                Miscellaneous.find({ user: req.user._id })
            ]);

            const data = {
                workExp,
                projects,
                skills,
                education,
                certifications,
                achievements,
                miscellaneous
            };

            const resumeData = await AI.generateResumeFromPrompt(data, prompt.trim());
            if (!resumeData) {
                return res.status(502).json({
                    success: false,
                    message: "Failed to process AI resume generation request"
                });
            }

            const newResume = await Resume.create({
                user: req.user._id,
                profile: profileID,
                prompt: prompt.trim(),
                workExp: resumeData.workExp || [],
                projects: resumeData.projects || [],
                skills: resumeData.skills || [],
                education: resumeData.education || [],
                certifications: resumeData.certifications || [],
                achievements: resumeData.achievements || [],
                extra: resumeData.extra || [],
                company: resumeData.company || "",
                title: resumeData.title || "Custom Resume",
                role: resumeData.role || "",
                ats: resumeData.ats || 0
            });

            return res.status(201).json({
                success: true,
                message: "Resume created successfully",
                resume: newResume
            });
        } catch (e) {
            console.error("Error creating resume from prompt:", e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while creating resume"
            });
        }
    }

    async getResume(req, res) {
        try {
            const resumes = await Resume.find();
            return res.status(200).json({
                success: true,
                message: "Resumes fetched successfully",
                resumes
            });
        } catch (e) {
            console.error("Error fetching all resumes:", e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching resumes"
            });
        }
    }

    async getUserResumes(req, res) {
        try {
            const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
            return res.status(200).json({
                success: true,
                message: "Resumes fetched successfully",
                resumes
            });
        } catch (e) {
            console.error("Error fetching user resumes:", e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching resumes"
            });
        }
    }

    async getResumeById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Resume ID is required"
                });
            }

            const resume = await Resume.findOne({ _id: id, user: req.user._id });
            if (!resume) {
                return res.status(404).json({
                    success: false,
                    message: "Resume not found or unauthorized"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Resume fetched successfully",
                resume
            });
        } catch (e) {
            console.error("Error fetching resume by ID:", e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while fetching resume"
            });
        }
    }

    async updateResume(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Resume ID is required"
                });
            }

            const resume = await Resume.findOne({ _id: id, user: req.user._id });
            if (!resume) {
                return res.status(404).json({
                    success: false,
                    message: "Resume not found or unauthorized"
                });
            }

            const allowedFields = [
                "title", "company", "role", "ats", "workExp",
                "projects", "skills", "education", "certifications",
                "achievements", "extra"
            ];

            allowedFields.forEach((field) => {
                if (req.body[field] !== undefined) {
                    resume[field] = req.body[field];
                }
            });

            await resume.save();

            return res.status(200).json({
                success: true,
                message: "Resume updated successfully",
                resume
            });
        } catch (e) {
            console.error("Error updating resume:", e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while updating resume"
            });
        }
    }

    async deleteResume(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Resume ID is required"
                });
            }

            const resume = await Resume.findOneAndDelete({ _id: id, user: req.user._id });
            if (!resume) {
                return res.status(404).json({
                    success: false,
                    message: "Resume not found or unauthorized"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Resume deleted successfully"
            });
        } catch (err) {
            console.error("Error deleting resume:", err);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while deleting resume"
            });
        }
    }
}

export default new ResumeController();
