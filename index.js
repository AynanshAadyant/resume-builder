import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./src/db/connect.js";

dotenv.config({ override: true });

const port = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectDB();
        
        const server = app.listen(port, () => {
            console.log(`Server running on PORT : ${port}`);
        });

        // Graceful shutdown handling
        const shutdown = (signal) => {
            console.log(`Received ${signal}. Shutting down gracefully...`);
            server.close(() => {
                console.log("HTTP server closed.");
                process.exit(0);
            });
        };

        process.on("SIGINT", () => shutdown("SIGINT"));
        process.on("SIGTERM", () => shutdown("SIGTERM"));

    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
}

startServer();