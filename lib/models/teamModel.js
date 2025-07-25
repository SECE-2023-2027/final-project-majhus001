// lib/teamModel.js
import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  rollNo: String
});

const TeamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    unique: true,
  },
  members: [StudentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Team || mongoose.model("Team", TeamSchema);
