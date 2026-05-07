import app from "./app.js";
import dotenv from 'dotenv';
import connectDB from "./src/db/connect.js";
import authRoutes from "./src/routes/auth.routes.js";
import profileRoutes from "./src/routes/profile.routes.js";
import jdRoutes from "./src/routes/jd.routes.js";

dotenv.config({ override: true });

await connectDB();

const port = process.env.PORT || 8000;

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jd", jdRoutes);

app.listen(port, () => {
    console.log(`Server running on PORT : ${port} `)
})