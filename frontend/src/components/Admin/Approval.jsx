import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const Approval = () => {
    const [recruiters, setRecruiters] = useState([])
    const [filteredRecruiters, setFilteredRecruiters] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const { toast } = useToast()
    const API_URL = import.meta.env.VITE_REACT_APP_API_URL

    const fetchRecruiters = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`${API_URL}/admin/getalluser`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            })
            const data = await res.json()
            if (data.success) {
                const filtered = data.data.filter(user => user.role === "recruiter")
                setRecruiters(filtered)
                setFilteredRecruiters(filtered)
                //console.log("RECRUITERS", recruiters)
            }
        } catch (error) {
            console.error("Error fetching recruiters:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleApprove = async (userId) => {
        try {
            const res = await fetch(`${API_URL}/admin/changePostJobStatus`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify({ userId }),
            })
            const data = await res.json()
            if (data.success) {
                setRecruiters(prev =>
                    prev.map(user =>
                        user._id === userId ? { ...user, isAllowedToPostJob: true } : user
                    )
                )
                toast({ title: "User Approved", description: "Recruiter can now post jobs." })
            } else {
                toast({ title: "Error", description: data.message, variant: "destructive" })
            }
        } catch (error) {
            console.error("Error approving recruiter:", error)
            toast({ title: "Error", description: "Something went wrong", variant: "destructive" })
        }
    }

    useEffect(() => {
        fetchRecruiters()
    }, [])

    useEffect(() => {
        let filtered = recruiters;

        if (search) {
            filtered = filtered.filter(recruiter =>
            (recruiter.username.toLowerCase().includes(search.toLowerCase()) ||
                (recruiter.fullName || "").toLowerCase().includes(search.toLowerCase()))
            );
        }

        if (filterStatus !== "all") {
            filtered = filtered.filter(recruiter =>
                filterStatus === "approved" ? recruiter.isAllowedToPostJob : !recruiter.isAllowedToPostJob
            );
        }

        setFilteredRecruiters(filtered);
    }, [search, filterStatus, recruiters]);


    return (
        <Card className="p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <h2 className="text-xl font-bold mb-4">Approval Panel</h2>

            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <Input
                    placeholder="Search Recruiter"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="md:w-1/3"
                    />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
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
                                <TableHead>Recruiter</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRecruiters.map(recruiter => (
                                <TableRow key={recruiter._id}>
                                    <TableCell>
                                        <div className="font-medium">
                                            {recruiter.username}
                                            <div className="text-sm text-muted-foreground">
                                                {recruiter.fullname}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{recruiter.email}</TableCell>
                                    <TableCell>{recruiter.location || "N/A"}</TableCell>
                                    <TableCell>
                                        <strong>{recruiter.company || "N/A"}</strong>
                                        <p className="text-sm text-gray-600">
                                            {recruiter.companyDescription || "No description"}
                                        </p>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant={recruiter.isAllowedToPostJob ? "secondary" : "default"}
                                            disabled={recruiter.isAllowedToPostJob}
                                            onClick={() => handleApprove(recruiter._id)}
                                        >
                                            {recruiter.isAllowedToPostJob ? "Approved" : "Approve"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            )}
        </Card>
    )
}

export default Approval
