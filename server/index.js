import path from "path";
import { fileURLToPath } from "url";

import dotenv from "dotenv";
import express from "express";

import connectDB from "./config/db.js";
import Student from "./models/Student.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (_req, res) => {
    res.send("Student Manager API is running");
});

app.post("/api/students", async (req, res) => {
    try {
        const { name, age, dep, country } = req.body;

        const student = await Student.create({
            name,
            age: Number(age),
            dep,
            country,
        });

        res.status(201).json({
            message: "Student inserted successfully",
            student,
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to insert student",
            error: error.message,
        });
    }
});

app.get("/api/students", async (_req, res) => {
    try {
        const students = await Student.find().sort({ _id: -1 });

        res.json(students);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch students",
            error: error.message,
        });
    }
});

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
