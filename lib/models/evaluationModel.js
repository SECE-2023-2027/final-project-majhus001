import mongoose from 'mongoose';

const EvalSchema = new mongoose.Schema({
  evaluator: String,
  teamName: String,
  evaluations: [
    {
      peer: String,
      contribution: Number,
      teamwork: Number,
      comments: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Evaluation || mongoose.model('Evaluation', EvalSchema);
