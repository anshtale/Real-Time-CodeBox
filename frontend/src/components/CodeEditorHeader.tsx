"use client"

import { Code2, Play, Loader2 } from "lucide-react"
import { LanguageDropdown } from "./LanguageDropDown"
import { Button } from "./ui/button"

interface CodeEditorHeaderProps {
  language: string
  onLanguageChange: (language: string) => void
  onSubmit: () => void
  isLoading: boolean
  currentButtonState: string
}

export const CodeEditorHeader = ({
  language,
  onLanguageChange,
  onSubmit,
  isLoading,
  currentButtonState,
}: CodeEditorHeaderProps) => {
  return (
    <div
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-6 bg-white/5 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl"
      style={{ position: "relative", zIndex: 10 }}
    >
      <div className="flex items-center justify-center gap-3">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <Code2 className="w-6 h-6 text-white" />
        </div>
        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Code Together
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <LanguageDropdown value={language} onChange={onLanguageChange} />

        <Button
          onClick={onSubmit}
          disabled={isLoading}
          type="button"
          className={`
            px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform
            ${
              isLoading
                ? "bg-gray-600 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-101 shadow-lg hover:shadow-xl"
            }
            text-white flex items-center gap-2
          `}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          <span>{currentButtonState}</span>
        </Button>
      </div>
    </div>
  )
}
