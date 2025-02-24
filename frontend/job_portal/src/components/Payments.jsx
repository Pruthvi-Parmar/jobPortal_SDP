import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner"; // ShadCN Sonner for notifications
import { Button } from "../components/ui/button";

const Payment = () => {
   
    
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.auth.userData);

    // Ensure user exists before proceeding
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

            // Ensure Razorpay script is loaded
            if (!window.Razorpay) {
                throw new Error("Razorpay SDK not loaded. Check your internet connection.");
            }

            // Create Razorpay order
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
                amount: res.data.data.order.amount * 100, // Amount in paise
                currency: "INR",
                name: "Job Portal",
                description: "Premium Membership",
                order_id: res.data.data.order.id, // Use dynamic order ID
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
                            toast.success("Payment Successful! 🎉");
                            setTimeout(() => window.location.reload(), 3000);
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
                theme: { color: "#4F46E5" }, // Updated theme color to match your project
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

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white shadow-lg rounded-lg max-w-lg w-full p-6 space-y-6">
                <h1 className="text-2xl font-bold text-center text-gray-800">Premium Membership</h1>
                <p className="text-center text-gray-500 text-sm">Get access to exclusive features by becoming a premium member.</p>
                <Button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500"
                >
                    {loading ? "Processing..." : "Buy Premium Membership"}
                </Button>
            </div>
        </div>
    );
};

export default Payment;
