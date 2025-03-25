"use client"

import { useRef } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import DownloadMenu from "../../ui/DownloadMenu"
import { downloadChartData } from "../utils/downloadUtils"

export default function TopCategoriesChart({ data }) {
  const chartRef = useRef(null)

  // Transform data for better display
  const transformedData = data.map((item) => ({
    category: item._id,
    applications: item.totalApplications,
  }))

  const handleDownload = (format) => {
    downloadChartData(transformedData, "top-categories", format, format === "pdf" ? chartRef.current : null)
  }

  return (
    <div className="relative h-full" ref={chartRef}>
      <DownloadMenu onDownload={handleDownload} className="absolute top-0 right-0 z-10" />
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={transformedData}
          layout="vertical"
          margin={{
            top: 20,
            right: 30,
            left: 70,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis dataKey="category" type="category" tick={{ fontSize: 12 }} width={60} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <Legend />
          <Bar dataKey="applications" fill="#8884d8" name="Applications" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

