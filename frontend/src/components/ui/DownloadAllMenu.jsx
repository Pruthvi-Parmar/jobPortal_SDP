"use client"

import React, { useState, useRef } from "react"
import { Download, FileText, FileSpreadsheet, ChevronDown } from "lucide-react"

export default function DownloadAllMenu({ onDownload, className = "" }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleDownload = (format) => {
    onDownload(format)
    setIsOpen(false)
  }

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        <Download size={16} />
        Download All Data
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          <ul className="py-1">
            <li>
              <button
                onClick={() => handleDownload("csv")}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FileText size={16} />
                Download as CSV
              </button>
            </li>
            <li>
              <button
                onClick={() => handleDownload("xlsx")}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FileSpreadsheet size={16} />
                Download as Excel
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

