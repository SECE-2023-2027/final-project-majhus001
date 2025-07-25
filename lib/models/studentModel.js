import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: "Sece@2023" },
    role: { type: String, required: true },
    type: { type: String, default: "Student" },
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", studentSchema);
