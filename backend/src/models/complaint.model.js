import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
  },
  { timestamps: true }
);

export const Complaint = mongoose.model("Complaint", complaintSchema);