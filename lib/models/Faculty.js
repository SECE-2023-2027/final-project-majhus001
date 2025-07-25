import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["Faculty", "admin"], default: "Faculty" },
  },
  { timestamps: true }
);

export default mongoose.models.Faculty || mongoose.model("Faculty", UserSchema);
