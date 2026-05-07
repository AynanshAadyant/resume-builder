import express from 'express';
import cookieParser from "cookie-parser";

const app = express();

// MIDDLEWARES
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }))

export default app;