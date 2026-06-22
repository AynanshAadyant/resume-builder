import app from "./app.js";
import dotenv from 'dotenv';
import connectDB from "./src/db/connect.js";
import authRoutes from "./src/routes/auth.routes.js";
import profileRoutes from "./src/routes/profile.routes.js";
import jdRoutes from "./src/routes/jd.routes.js";
import resumeRoutes from "./src/routes/resume.routes.js";
import AI from "./src/services/ai.service.js"

dotenv.config({ override: true });

await connectDB();
console.log(await AI.testConnection());

const port = process.env.PORT || 8000;

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jd", jdRoutes);
app.use("/api/resume", resumeRoutes);

app.get( '/api/wakeup', async( req, res) => {
    console.log( "Backend woke up" )
    return res.status( 200 ).json( {
        success: true,
        message: "Backend up and running"
    })
})

app.listen(port, () => {
    console.log(`Server running on PORT : ${port} `)
})