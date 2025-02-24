import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true
        },
        razorpayOrderId: { 
            type: String, 
            required: true
        },
        razorpayPaymentId: { 
            type: String
        },
        amount: { 
            type: Number, 
            required: true
        },
        status: { 
            type: String, 
            enum: ["pending", "paid"], 
            default: "pending"
        },
        createdAt: { 
            type: Date, 
            default: Date.now 
        },
    }
);

export default mongoose.model("Payment", paymentSchema);
