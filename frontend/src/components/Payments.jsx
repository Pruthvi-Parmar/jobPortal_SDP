import { useState, useEffect } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, Zap, Award, Lock } from "lucide-react"
import { login, updateUser } from "@/store/authSlice"

const Payment = () => {
  const [loading, setLoading] = useState(false)
  const user = useSelector((state) => state.auth.userData)
  const dispatch = useDispatch()
  const [isPremiumUser, setIsPremiumUser] = useState(false)
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL

  useEffect(() => {
    if (user) {
      setIsPremiumUser(user.isPremium)
    }
  }, [user])

  //console.log(user)

  if (!user) {
    toast.error("User not found! Please log in.")
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access premium features</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button disabled className="w-full">
              Login Required
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const userId = user._id

  const handlePayment = async () => {
    try {
      setLoading(true)

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded. Check your internet connection.")
      }

      const res = await axios.post(
        `${API_URL}/payment/create-order`,
        { amount: 499 },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        },
      )

      if (!res.data.data.order) {
        throw new Error("Invalid order response from server.")
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: res.data.data.order.amount * 100,
        currency: "INR",
        name: "Job Portal",
        description: "Premium Membership",
        order_id: res.data.data.order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post(
              `${API_URL}/payment/verify-payment`,
              { ...response, userId },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
              },
            )

            if (verifyResponse.data.success) {
              const updatedUser = { ...user, isPremium: true }
              dispatch(updateUser(updatedUser))
              dispatch(login(updatedUser))

              // TODO: here after dispaching we are updating state of user which
              //        is stored in redux check if above line creating any problem
              //        in previous redux related logic!!!!!
              //console.log(user)

              toast.success("Payment Successful! 🎉")
              //setTimeout(() => window.location.reload(), 3000);
            } else {
              toast.error("Payment verification failed. Please contact support.")
            }
          } catch (error) {
            console.error("Payment verification error:", error)
            toast.error("Payment verification failed! ❌")
          }
        },
        prefill: {
          name: user.name || "Test User",
          email: user.email || "test@example.com",
          contact: user.phone || "9999999999",
        },
        theme: { color: "#4F46E5" },
      }

      const razorpayInstance = new window.Razorpay(options)
      razorpayInstance.open()
    } catch (error) {
      console.error("Payment error:", error)
      toast.error(error.message || "Payment Failed! Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const newUser = useSelector((state) => state.auth.userData)
  //console.log(newUser)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-3xl px-4">
        <Card className="overflow-hidden border-0 shadow-xl">
          {isPremiumUser ? (
            <div className="p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-100 rounded-full scale-150 animate-pulse opacity-30"></div>
                  <CheckCircle className="relative z-10 text-green-500 w-20 h-20" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-gray-800">Premium Membership Active</h1>
                  <p className="text-gray-500 max-w-md mx-auto">
                    You now have access to all premium features and benefits. Thank you for your support!
                  </p>
                </div>
                <Badge variant="outline" className="px-3 py-1 bg-green-50 text-green-700 border-green-200">
                  Premium Member
                </Badge>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-6">
                  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <Zap className="h-6 w-6 text-amber-500 mb-2" />
                    <span className="text-sm font-medium">Priority Access</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <Shield className="h-6 w-6 text-blue-500 mb-2" />
                    <span className="text-sm font-medium">Advanced Tools</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <Award className="h-6 w-6 text-purple-500 mb-2" />
                    <span className="text-sm font-medium">Profile Boost</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                    <Lock className="h-6 w-6 text-green-500 mb-2" />
                    <span className="text-sm font-medium">Exclusive Jobs</span>
                  </div>
                </div>
                <Button className="mt-6 w-full max-w-md bg-green-600 hover:bg-green-700" disabled>
                  Premium Activated ✓
                </Button>
              </div>
            </div>
          ) : (
            <div className="md:grid md:grid-cols-5">
              <div className="hidden md:block md:col-span-2 bg-indigo-600 text-white p-8">
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Premium Benefits</h2>
                    <ul className="space-y-4">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-indigo-300" />
                        <span>Priority application to top jobs</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-indigo-300" />
                        <span>Advanced resume visibility to employers</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-indigo-300" />
                        <span>Exclusive access to premium job listings</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-indigo-300" />
                        <span>Personalized job recommendations</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-indigo-300" />
                        <span>Career coaching and resume review</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-8">
                    <Badge className="bg-indigo-500/20 text-white hover:bg-indigo-500/30 border-none">
                      Limited Time Offer
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="col-span-3 p-8">
                <div className="flex flex-col h-full justify-center">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Upgrade to Premium</h1>
                    <p className="text-gray-500 max-w-md mx-auto">
                      Boost your job search with premium features designed to help you stand out.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-medium">Premium Membership</span>
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-bold">₹499</span>
                        <span className="text-sm text-gray-500">per month</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 my-4"></div>
                    <ul className="space-y-2 mb-4 md:hidden">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">Priority application to top jobs</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">Advanced resume visibility</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-sm">Exclusive premium job listings</span>
                      </li>
                    </ul>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      "Upgrade Now"
                    )}
                  </Button>

                  <p className="text-xs text-center text-gray-500 mt-4">
                    Secure payment processed by Razorpay. Cancel anytime.
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Payment

