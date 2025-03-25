"use client"

import { useRef } from "react"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import DownloadMenu from "../../ui/DownloadMenu"
import { downloadChartData } from "../utils/downloadUtils"

export default function ApplicationStatusChart({ data }) {
  const chartRef = useRef(null)

  // Transform data for better display
  const transformedData = data.map((item) => ({
    status: item._id,
    count: item.count,
  }))

  // Define colors for different statuses
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  const handleDownload = (format) => {
    downloadChartData(transformedData, "application-status", format, format === "pdf" ? chartRef.current : null)
  }

  return (
    <div className="relative h-full" ref={chartRef}>
      <DownloadMenu onDownload={handleDownload} className="absolute top-0 right-0 z-10" />
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={transformedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="count"
            nameKey="status"
            label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
          >
            {transformedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

