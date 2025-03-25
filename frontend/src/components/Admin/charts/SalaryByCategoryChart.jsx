"use client"

import { useRef } from "react"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import DownloadMenu from "../../ui/DownloadMenu"
import { downloadChartData } from "../utils/downloadUtils"

export default function SalaryByCategoryChart({ data }) {
  const chartRef = useRef(null)

  // Transform data for better display
  const transformedData = data.map((item) => ({
    category: item._id,
    salary: Math.round(item.averageSalary),
  }))

  // Format salary for tooltip
  const formatSalary = (value) => {
    return `$${value.toLocaleString()}`
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="font-medium">{`${label}`}</p>
          <p className="text-[#8884d8]">{`Average Salary: ${formatSalary(payload[0].value)}`}</p>
        </div>
      )
    }
    return null
  }

  const handleDownload = (format) => {
    downloadChartData(transformedData, "salary-by-category", format, format === "pdf" ? chartRef.current : null)
  }

  return (
    <div className="relative h-full" ref={chartRef}>
      <DownloadMenu onDownload={handleDownload} className="absolute top-0 right-0 z-10" />
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={transformedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" angle={-45} textAnchor="end" height={70} interval={0} />
          <YAxis tickFormatter={formatSalary} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="salary" fill="#8884d8" name="Average Salary" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

