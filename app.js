import express from 'express';
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express();

// MIDDLEWARES
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }))
app.use( cors( {
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:4173' ],
    credentials: true
}))

export default app;