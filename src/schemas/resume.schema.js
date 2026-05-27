import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    jd : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JD"
    },
    prompt: {
        type: string,
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile"
    },
    workExp: [{
        organisation: {
            type: String,
            trim: true
        },
        post: {
            type: String,
            trim: true
        },
        location: {
            type: String,
            trim: true
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },

        contents: [{
            type: String
        }]
    }],
    projects: [{
        title: {
            type: String,
            trim: true
        },
        techStack: [{
            type: String,
            trim: true
        }],
        contents: [{
            type: String,
            trim: true
        }],
        githubLink: {
            type: String,
            trim: true
        },
        projectLink: {
            type: String,
            trim: true
        }
    }],
    skills: [{
        type: String,
        trim: true
    }],
    education: [{
        institution: {
            type: String,
            trim: true
        },
        degree: {
            type: String,
            trim: true
        },
        fieldOfStudy: {
            type: String,
            trim: true
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        location: {
            type: String,
            trim: true
        },
        gpa: {
            type: String,
            trim: true
        }
    }],
    certifications: [{
        name: {
            type: String,
            trim: true
        },
        contents: [{
            type: String
        }],
        url: {
            type: String,
            trim: true
        }
    }],
    achievements: [{
        name: {
            type: String,
            trim: true
        },
        contents: [{
            type: String
        }],
        url: {
            type: String,
            trim: true
        }
    }],
    extra: [{
        title: {
            type: String,
            trim: true
        },
        contents: [{
            type: String
        }]
    }]
})

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;