import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner"; 
import { Button } from "../components/ui/button";
import { CheckCircle } from "lucide-react";
import { login, updateUser } from '@/store/authSlice';

const Payment = () => {
   
    
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.auth.userData);
    const dispatch = useDispatch()
    console.log(user);

    
    


    if (!user) {
        toast.error("User not found! Please log in.");
        return (
            <Button disabled className="w-full bg-gray-300">
                Login Required
            </Button>
        );
    }

    const userId = user._id;

    const handlePayment = async () => {
        try {
            setLoading(true);

            
            if (!window.Razorpay) {
                throw new Error("Razorpay SDK not loaded. Check your internet connection.");
            }

            
            const res = await axios.post(
                "http://localhost:8001/v1/payment/create-order",
                { amount: 499 },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                }
            );

            if (!res.data.data.order) {
                throw new Error("Invalid order response from server.");
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: res.data.data.order.amount * 100, 
                currency: "INR",
                name: "Job Portal",
                description: "Premium Membership",
                order_id: res.data.data.order.id, 
                handler: async function (response) {
                    try {
                        const verifyResponse = await axios.post(
                            "http://localhost:8001/v1/payment/verify-payment",
                            { ...response, userId },
                            {
                                headers: {
                                    "Content-Type": "application/json",
                                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                                },
                            }
                        );

                        if (verifyResponse.data.success) {
                            const updatedUser = { ...user, isPremium: true }; 
                            dispatch(updateUser(updatedUser)); 
                            dispatch(login(updatedUser))
                            
                    // TODO: here after dispaching we are updating state of user which
                    //        is stored in redux check if above line creating any problem 
                    //        in previous redux related logic!!!!!
                            console.log(user);
                            
                            toast.success("Payment Successful! 🎉");
                            //setTimeout(() => window.location.reload(), 3000);
                        } else {
                            toast.error("Payment verification failed. Please contact support.");
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        toast.error("Payment verification failed! ❌");
                    }
                },
                prefill: {
                    name: user.name || "Test User",
                    email: user.email || "test@example.com",
                    contact: user.phone || "9999999999",
                },
                theme: { color: "#4F46E5" }, 
            };

            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.open();
        } catch (error) {
            console.error("Payment error:", error);
            toast.error(error.message || "Payment Failed! Please try again.");
        } finally {
            setLoading(false);
        }
        
        
    };
    const newUser = useSelector((state) => state.auth.userData);
        console.log(newUser);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white shadow-lg rounded-lg max-w-lg w-full p-6 space-y-6">
                {newUser.isPremium ? (
                    
                    <div className="text-center">
                        <CheckCircle className="mx-auto text-green-500 w-16 h-16" />
                        <h1 className="text-2xl font-bold text-gray-800">You are a Premium Member!</h1>
                        <p className="text-gray-500 mt-2">
                            Enjoy exclusive features and benefits as a premium user.
                        </p>
                        <Button className="mt-4 w-full bg-green-600 text-white" disabled>
                            Premium Activated ✅
                        </Button>
                    </div>
                ) : (
                    
                    <>
                        <h1 className="text-2xl font-bold text-center text-gray-800">Premium Membership</h1>
                        <p className="text-center text-gray-500 text-sm">
                            Get access to exclusive features by becoming a premium member.
                        </p>
                        <Button
                            onClick={handlePayment}
                            disabled={loading}
                            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                        >
                            {loading ? "Processing..." : "Buy Premium Membership"}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Payment;
