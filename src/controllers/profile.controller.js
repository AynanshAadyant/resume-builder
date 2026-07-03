import Achievement from "../schemas/achievements.schema.js";
import Certification from "../schemas/certifications.schema.js";
import Education from "../schemas/education.schema.js";
import Project from "../schemas/projects.schema.js";
import Skill from "../schemas/skills.schema.js";
import workExperience from "../schemas/work.schema.js";
import Miscellaneous from "../schemas/miscellanous.schema.js";
import User from "../schemas/user.schema.js";
import Profile from "../schemas/profile.schema.js";

class ProfileController {
    constructor() { }

    async create(req, res) {
        try {
            const user = req.user._id;
            let { location="", phoneNo, linkedIn="", github="", portfolio="", workExperiences = [], projects = [], certifications = [], education = [], skills = [], achievements = [], miscellaneous = [] } = req.body;

            if( !location || location.trim() === "" ) {
                return res.status( 400 ).json( {
                    success: false,
                    message: "Location required"
                })
            }
            if( !phoneNo || phoneNo.trim() === "" ) {
                return res.status( 400 ).json( {
                    success: false,
                    message: "Phone number required"
                })
            }

            if( typeof phoneNo === "string" )
                phoneNo = Number( phoneNo )
                
            const profile = await Profile.create({
                user,
                location,
                phoneNo,
                linkedIn,
                github,
                portfolio
            })

            const workEx = workExperiences.length > 0 ? await workExperience.insertMany(workExperiences.map((w) => {
                    return {
                        ...w,
                        user
                    }
                })) : [];

            const proj = projects.length > 0 ?
                await Project.insertMany(projects.map((p) => {
                    return {
                        ...p,
                        user
                    }
                })) : [];

            const certs = certifications.length > 0 ? 
                await Certification.insertMany(certifications.map((c) => {
                    return {
                        ...c,
                        user
                    }
                })) : [];

            const edu = education.length > 0 ? 
                await Education.insertMany(education.map((e) => {
                    return {
                        ...e,
                        user
                    }
                })) : [];

            const sk = skills.length > 0 ? 
                await Skill.insertMany(skills.map((s) => {
                    return {
                        ...s,
                        user
                    }
                })) : [];

            const achieve = achievements.length > 0 ? 
                await Achievement.insertMany(achievements.map((a) => {
                    return {
                        ...a,
                        user
                    }
                })) : [];

            const misc = miscellaneous.length > 0 ? 
                await Miscellaneous.insertMany(miscellaneous.map((m) => {
                    return {
                        ...m,
                        user
                    }
                })) : [];

            return res.status(200).json({
                success: true,
                message: "Profile created successfully",
                data: {
                    profile,
                    workExperiences: workEx,
                    projects: proj,
                    certifications: certs, 
                    education: edu,
                    skills: sk,
                    achievements: achieve,
                    miscellaneous: misc
                }
            })
        }
        catch (e) {
            console.log("ERROR while creating profile :", e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while creating profile"
            })
        }
    }

    async get(req, res) {
        try {
            const user = req.user;
            const id = user._id; 
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "User or ID is required"
                })
            }

            const profileData = await Promise.all([
                Profile.findOne({ user: id }),
                workExperience.find({ user: id }),
                Project.find({ user: id }),
                Certification.find({ user: id }),
                Education.find({ user: id }),
                Skill.find({ user: id }),
                Achievement.find({ user: id }),
                Miscellaneous.find({ user: id })
            ]) 

            return res.status(200).json({
                success: true,
                message: "Profile fetched successfully",
                data: {
                    profile : profileData[0],
                    workExperiences: profileData[1],
                    projects: profileData[2],
                    certifications: profileData[3],
                    education: profileData[4],
                    skills: profileData[5],
                    achievements: profileData[6],
                    miscellaneous: profileData[7]
                }
            })


        }
        catch (e) {
            console.log("ERROR while getting profile :", e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while getting profile"
            })
        }

    }

    async getAll(req, res) {
        try {

            const admin = req?.admin;

            if (!admin) {
                return res.status(400).json({
                    success: false,
                    message: "Admin not found"
                });
            }

            const allUsers = await User.find();

            const allProfiles = await Promise.all(

                allUsers.map(async (user) => {

                    const profile = await Promise.all([
                        workExperience.find({ user: user._id }),
                        Project.find({ user: user._id }),
                        Certification.find({ user: user._id }),
                        Education.find({ user: user._id }),
                        Skill.find({ user: user._id }),
                        Achievement.find({ user: user._id }),
                        Miscellaneous.find({ user: user._id })
                    ]);

                    return {
                        userId: user._id,
                        profile: {
                            workExperience: profile[0],
                            projects: profile[1],
                            certifications: profile[2],
                            education: profile[3],
                            skills: profile[4],
                            achievements: profile[5],
                            miscellaneous: profile[6]
                        }
                    };

                })

            );

            return res.status(200).json({
                success: true,
                message: "All profiles fetched successfully",
                data: allProfiles
            });

        }
        catch (e) {

            console.log("ERROR while getting all profiles :", e);

            return res.status(500).json({
                success: false,
                message: "Something went wrong while getting all profiles"
            });

        }
    }

    async update(req, res) {
        const user = req.user;
        const { location, phoneNo, linkedIn, github, portfolio, workExperiences = [], projects = [], certifications = [], education = [], skills = [], achievements = [], miscellaneous = [] } = req.body;

        try {
            // Update Base Profile
            const existingProfile = await Profile.findOne({ user: user._id });
            if (existingProfile) {
                await Profile.findOneAndUpdate({_id : existingProfile._id, user : user._id}, { location, phoneNo, linkedIn, github, portfolio });
            } else if (location || phoneNo) { 
                await Profile.create({ user: user._id, location, phoneNo, linkedIn, github, portfolio });
            }

            if (workExperiences.length > 0) {
                await Promise.all(workExperiences.map(async (w) => {
                    if (w._id) {
                        await workExperience.findByIdAndUpdate(w._id, w)
                    } else {
                        await workExperience.create({ ...w, user: user._id })
                    }
                }))
            }

            if (projects.length > 0) {
                await Promise.all(projects.map(async (p) => {
                    if (p._id) {
                        await Project.findByIdAndUpdate(p._id, p)
                    } else {
                        await Project.create({ ...p, user: user._id })
                    }
                }))
            }

            if (certifications.length > 0) {
                await Promise.all(certifications.map(async (c) => {
                    if (c._id) {
                        await Certification.findByIdAndUpdate(c._id, c)
                    } else {
                        await Certification.create({ ...c, user: user._id })
                    }
                }))
            }

            if (education.length > 0) {
                await Promise.all(education.map(async (e) => {
                    if (e._id) {
                        await Education.findByIdAndUpdate(e._id, e)
                    } else {
                        await Education.create({ ...e, user: user._id })
                    }
                }))
            }

            if (skills.length > 0) {
                await Promise.all(skills.map(async (s) => {
                    if (s._id) {
                        await Skill.findByIdAndUpdate(s._id, s)
                    } else {
                        await Skill.create({ ...s, user: user._id })
                    }
                }))
            }

            if (achievements.length > 0) {
                await Promise.all(achievements.map(async (a) => {
                    if (a._id) {
                        await Achievement.findByIdAndUpdate(a._id, a)
                    } else {
                        await Achievement.create({ ...a, user: user._id })
                    }
                }))
            }

            if (miscellaneous.length > 0) {
                await Promise.all(miscellaneous.map(async (m) => {
                    if (m._id) {
                        await Miscellaneous.findByIdAndUpdate(m._id, m)
                    } else {
                        await Miscellaneous.create({ ...m, user: user._id })
                    }
                }))
            }

            return res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                data: {
                    profile : {
                        user,
                        location,
                        phoneNo,
                        linkedIn,
                        github,
                        portfolio 

                    },
                    workExperiences,
                    projects,
                    certifications,
                    education,
                    skills,
                    achievements,
                    miscellaneous
                }
            });
        }
        catch (e) {
            console.log("ERROR while updating profile :", e);
            return res.status(500).json({
                success: false,
                message: "Something went wrong while updating profile",

            })
        }
    }

    async delete(req, res) {
        const user = req.user;

        await workExperience.deleteMany({ user: user._id });
        await Project.deleteMany({ user: user._id });
        await Certification.deleteMany({ user: user._id });
        await Education.deleteMany({ user: user._id });
        await Skill.deleteMany({ user: user._id });
        await Achievement.deleteMany({ user: user._id });
        await Miscellaneous.deleteMany({ user: user._id });

        return res.status(200).json({
            success: true,
            message: "Profile deleted successfully"
        })
    }
}

export default new ProfileController();