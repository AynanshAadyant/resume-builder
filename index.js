import app from "./app.js";
import dotenv from 'dotenv';
import connectDB from "./src/db/connect.js";

dotenv.config({});

await connectDB();

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server running on PORT : ${port} `)
})