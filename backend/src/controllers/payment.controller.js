import Razorpay from "razorpay";
import crypto from "crypto";
import Payment from "../models/payment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Use your actual key
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

//  function testRazorpay() {
//     console.log(process.env.RAZORPAY_KEY_ID);
    
// }

// testRazorpay();

const createOrder = asyncHandler(async(req, res) => {

    console.log("inside controller");
    
    
    const { amount } = req.body;
    const userId = req.user._id
    console.log("req body : ",req.body);
    
    
    const options = {
        amount: amount * 100, // Convert to paise
        currency: "INR",
        receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await razorpay.orders.create({
        amount: amount * 100, // Convert INR to paise
        currency: "INR",
        receipt: "test_receipt_123",
    });

    const payment = new Payment({
        userId,
        razorpayOrderId: order.id,
        amount,
        status: "pending",
    });

    await payment.save();

    if(!payment){
        throw new ApiError(500,"order failed")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                success: true,
                order
            },
            "order complete succesfully!"
        )
    )

})

const verifyPayment = asyncHandler(async(req, res) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        
        throw new ApiError(400,"Invalid Signature")
    }

    await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { razorpayPaymentId: razorpay_payment_id, status: "paid" }
    );

    if(!Payment){
        throw new ApiError(500,"payment verification failed")
    }

    

    const user = await User.findByIdAndUpdate(
        req.user._id, 
        { isPremium: true }, 
        { new: true }
    );
    user.save()

    console.log(user);
    

    if(!user){
        throw new ApiError(500,"user status is not updated")
    }
    
    


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                success: true,
            },
            "payment verification sucessful!"
        )
    )

    
})

export{
    createOrder,
    verifyPayment
}