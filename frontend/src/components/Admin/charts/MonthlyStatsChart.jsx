"use client"

import { useRef } from "react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import DownloadMenu from "../../ui/DownloadMenu"
import { downloadChartData } from "../utils/downloadUtils"

export default function MonthlyStatsChart({ data, dataKey, stroke, fill, showGrid = false, title = "Chart Data" }) {
  const chartRef = useRef(null)

  const handleDownload = (format) => {
    downloadChartData(
      data,
      title.replace(/\s+/g, "-").toLowerCase(),
      format,
      format === "pdf" ? chartRef.current : null,
    )
  }

  return (
    <div className="relative h-full" ref={chartRef}>
      <DownloadMenu onDownload={handleDownload} className="absolute top-0 right-0 z-10" />
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <Legend />
          <Area type="monotone" dataKey={dataKey} stroke={stroke} fill={fill} activeDot={{ r: 8 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

