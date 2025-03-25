/**
 * Converts data to CSV format
 * @param {Array} data - The data to convert
 * @param {Array} headers - The headers for the CSV
 * @returns {string} - The CSV string
 */
export const convertToCSV = (data, headers) => {
    if (!data || !data.length) return ""
  
    const headerRow = headers.join(",")
    const rows = data
      .map((item) => {
        return headers
          .map((header) => {
            // Handle cases where the value might contain commas or quotes
            let value = item[header]
            if (value === undefined || value === null) value = ""
            value = String(value)
  
            // Escape quotes and wrap in quotes if contains commas or quotes
            if (value.includes('"') || value.includes(",")) {
              value = value.replace(/"/g, '""')
              value = `"${value}"`
            }
  
            return value
          })
          .join(",")
      })
      .join("\n")
  
    return `${headerRow}\n${rows}`
  }
  
  /**
   * Downloads data as a CSV file
   * @param {string} csvContent - The CSV content
   * @param {string} fileName - The name of the file
   */
  export const downloadCSV = (csvContent, fileName) => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
  
    link.setAttribute("href", url)
    link.setAttribute("download", `${fileName}.csv`)
    link.style.visibility = "hidden"
  
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  /**
   * Converts data to XLSX format and downloads it
   * @param {Array} data - The data to convert
   * @param {string} fileName - The name of the file
   */
  export const downloadXLSX = async (data, fileName) => {
    // Dynamically import xlsx library
    const XLSX = await import("xlsx")
  
    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data)
  
    // Create a workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data")
  
    // Generate XLSX file
    XLSX.writeFile(workbook, `${fileName}.xlsx`)
  }
  
  /**
   * Generates a PDF from a chart container and downloads it
   * @param {HTMLElement} chartContainer - The chart container element
   * @param {string} fileName - The name of the file
   */
  export const downloadPDF = async (chartContainer, fileName) => {
    // Dynamically import html2canvas and jspdf
    const html2canvas = (await import("html2canvas")).default
    const { jsPDF } = await import("jspdf")
  
    try {
      const canvas = await html2canvas(chartContainer, {
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        allowTaint: true,
      })
  
      const imgData = canvas.toDataURL("image/png")
  
      // Calculate dimensions to maintain aspect ratio
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
  
      const pdf = new jsPDF("p", "mm", "a4")
  
      // Add title
      pdf.setFontSize(16)
      pdf.text(fileName, 105, 15, { align: "center" })
  
      // Add image
      pdf.addImage(imgData, "PNG", 0, 25, imgWidth, imgHeight)
  
      // Add date
      pdf.setFontSize(10)
      const date = new Date().toLocaleDateString()
      pdf.text(`Generated on: ${date}`, 105, 287, { align: "center" })
  
      pdf.save(`${fileName}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    }
  }
  
  /**
   * Prepares and downloads chart data in the specified format
   * @param {Array} data - The chart data
   * @param {string} fileName - The name of the file
   * @param {string} format - The format to download (csv, xlsx, pdf)
   * @param {HTMLElement} chartRef - Reference to the chart container (for PDF only)
   */
  export const downloadChartData = (data, fileName, format = "csv", chartRef = null) => {
    if (!data || !data.length) {
      console.error("No data to download")
      return
    }
  
    // Format the filename with date
    const formattedFileName = `${fileName}-${new Date().toISOString().split("T")[0]}`
  
    // Extract headers from the first data item
    const headers = Object.keys(data[0])
  
    switch (format.toLowerCase()) {
      case "csv":
        const csvContent = convertToCSV(data, headers)
        downloadCSV(csvContent, formattedFileName)
        break
      case "xlsx":
        downloadXLSX(data, formattedFileName)
        break
      case "pdf":
        if (chartRef) {
          downloadPDF(chartRef, formattedFileName)
        } else {
          console.error("Chart reference is required for PDF download")
        }
        break
      default:
        console.error("Unsupported format:", format)
    }
  }
  
  /**
   * Downloads all chart data in the specified format
   * @param {Object} analyticsData - Object containing all chart data
   * @param {string} format - The format to download (csv, xlsx)
   */
  export const downloadAllData = async (analyticsData, format = "csv") => {
    // Create a formatted date for the filename
    const date = new Date().toISOString().split("T")[0]
  
    // Transform the datasets
    const monthlyJobs = analyticsData.monthlyJobs
    const monthlyApplications = analyticsData.monthlyApplications
    const monthlyUsers = analyticsData.monthlyUsers
  
    const topCategories = analyticsData.topCategories.map((item) => ({
      category: item._id,
      applications: item.totalApplications,
    }))
  
    const applicationStatus = analyticsData.applicationStatus.map((item) => ({
      status: item._id,
      count: item.count,
    }))
  
    const averageSalary = analyticsData.averageSalary.map((item) => ({
      category: item._id,
      salary: Math.round(item.averageSalary),
    }))
  
    if (format === "xlsx") {
      // For XLSX, we can create a single file with multiple sheets
      const XLSX = await import("xlsx")
  
      // Create a workbook
      const workbook = XLSX.utils.book_new()
  
      // Add each dataset as a separate sheet
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(monthlyJobs), "Monthly Jobs")
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(monthlyApplications), "Monthly Applications")
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(monthlyUsers), "Monthly Users")
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(topCategories), "Top Categories")
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(applicationStatus), "Application Status")
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(averageSalary), "Average Salary")
  
      // Generate XLSX file
      XLSX.writeFile(workbook, `job-portal-analytics-${date}.xlsx`)
    } else {
      // For CSV, we need to download separate files
      downloadChartData(monthlyJobs, `monthly-jobs-${date}`, format)
      downloadChartData(monthlyApplications, `monthly-applications-${date}`, format)
      downloadChartData(monthlyUsers, `monthly-users-${date}`, format)
      downloadChartData(topCategories, `top-categories-${date}`, format)
      downloadChartData(applicationStatus, `application-status-${date}`, format)
      downloadChartData(averageSalary, `average-salary-${date}`, format)
    }
  }
  
  