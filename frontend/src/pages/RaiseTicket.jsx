import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const RaiseTicket = () => {
    const [message, setMessage] = useState("");
    const user = useSelector((state) => state.auth.userData);
    const userId = user?._id;

    const handleSubmit = async () => {
        if (!userId) {
            toast.error("Login to raise a complaint.");
            return;
        }

        try {
            const res = await fetch(`{API_URL}/complaint/register-complaint`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, message }),
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Complaint registered successfully!");
                setMessage("");
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch (error) {
            toast.error("Failed to submit complaint. Try again later.");
        }
    };

    return (
        <Card className="max-w-xl mx-auto my-12 p-6 shadow-lg rounded-lg">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Raise a Complaint</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 mb-4">
                    Facing an issue? Let us know by submitting a complaint below. We’ll get back to you as soon as possible.
                </p>
                <Textarea
                    placeholder="Describe your issue here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-32 resize-none"
                />
                <Button className="mt-4 w-full" onClick={handleSubmit} disabled={!message.trim()}>
                    Submit Complaint
                </Button>
            </CardContent>
        </Card>
    );
};

export default RaiseTicket;