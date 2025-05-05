import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Complaint = () => {
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const { toast } = useToast();
    const [expandedMessages, setExpandedMessages] = useState({});
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL
    const fetchComplaints = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API_URL}/complaint/retrieve-complaint`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            const data = await res.json();
            if (data.success) {
                setComplaints(data.data.complaints);
                console.log(data.data.complaints);
                setFilteredComplaints(data.data.complaints);
            }
        } catch (error) {
            console.error("Error fetching complaints:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    useEffect(() => {
        let filtered = complaints;

        if (search) {
            filtered = filtered.filter(complaint => {
                const fullname = complaint.senderId?.fullname || "";
                const username = complaint.senderId?.username || "";
                const email = complaint.senderId?.email || "";
                return (
                    username.toLowerCase().includes(search.toLowerCase()) ||
                    fullname.toLowerCase().includes(search.toLowerCase()) ||
                    email.toLowerCase().includes(search.toLowerCase()) ||
                    complaint.message.toLowerCase().includes(search.toLowerCase())
                );
            });
        }

        if (filterRole !== "all") {
            filtered = filtered.filter(complaint => complaint.senderId?.role === filterRole);
        }

        setFilteredComplaints(filtered);
    }, [search, filterRole, complaints]);

    const toggleReadMore = (id) => {
        setExpandedMessages(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <Card className="p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl font-bold mb-4">Complaint Panel</h2>

                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <Input
                        placeholder="Search Complaints"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="md:w-1/3"
                    />
                    <Select value={filterRole} onValueChange={setFilterRole}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="jobseeker">Jobseeker</SelectItem>
                            <SelectItem value="recruiter">Recruiter</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Message</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredComplaints.length > 0 ? (
                                filteredComplaints.map(complaint => (
                                    <TableRow key={complaint._id}>
                                        {/* Username & Fullname */}
                                        <TableCell>
                                            <div className="font-medium">
                                                {complaint.senderId?.username || "User Deleted"}
                                                <div className="text-sm text-muted-foreground">
                                                    {complaint.senderId?.fullname || "N/A"}
                                                </div>
                                            </div>
                                        </TableCell>
                                        
                                        {/* Email */}
                                        <TableCell>{complaint.senderId?.email || "N/A"}</TableCell>
                                        
                                        {/* Role */}
                                        <TableCell>{complaint.senderId?.role || "Unknown"}</TableCell>
                                        
                                        {/* Read More functionality for Message */}
                                        <TableCell>
                                            {expandedMessages[complaint._id] || complaint.message.length <= 50
                                                ? complaint.message
                                                : complaint.message.slice(0, 50) + "... "}
                                            
                                            {complaint.message.length > 50 && (
                                                <Button
                                                    variant="link"
                                                    className="text-blue-500"
                                                    onClick={() => toggleReadMore(complaint._id)}
                                                >
                                                    {expandedMessages[complaint._id] ? "Read Less" : "Read More"}
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-gray-500">
                                        No complaints found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            )}
        </Card>
    );
};

export default Complaint;