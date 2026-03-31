import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
            min: 1,
        },
        dep: {
            type: String,
            required: true,
            trim: true,
        },
        country: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        collection: "students",
        versionKey: false,
    }
);

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
