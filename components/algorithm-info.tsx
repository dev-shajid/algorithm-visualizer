"use client"

import { Eye, EyeOff, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AlgorithmInfoProps {
  algorithm: {
    name: string
    complexity: { time: string; space: string }
    description: string
    code: string
  }
  showCode: boolean
  setShowCode: (show: boolean) => void
  showComplexityAnalysis: boolean
  setShowComplexityAnalysis: (show: boolean) => void
}

export function AlgorithmInfo({
  algorithm,
  showCode,
  setShowCode,
  showComplexityAnalysis,
  setShowComplexityAnalysis,
}: AlgorithmInfoProps) {
  return (
    <Card className="bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {algorithm?.name}
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowCode(!showCode)}>
              {showCode ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowComplexityAnalysis(!showComplexityAnalysis)}>
              <BookOpen size={16} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium">Time:</span>
            <Badge variant="outline" className="ml-2">
              {algorithm?.complexity.time}
            </Badge>
          </div>
          <div>
            <span className="font-medium">Space:</span>
            <Badge variant="outline" className="ml-2">
              {algorithm?.complexity.space}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-gray-600">{algorithm?.description}</p>

        {showCode && (
          <div className="mt-4">
            <pre className="bg-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
              <code>{algorithm?.code}</code>
            </pre>
          </div>
        )}

        {showComplexityAnalysis && (
          <div className="mt-4 p-3 bg-white rounded-lg border">
            <h5 className="font-semibold mb-2">Complexity Analysis</h5>
            <div className="text-sm space-y-1">
              <p>
                <strong>Best Case:</strong> Varies by algorithm
              </p>
              <p>
                <strong>Average Case:</strong> {algorithm?.complexity.time}
              </p>
              <p>
                <strong>Worst Case:</strong> {algorithm?.complexity.time}
              </p>
              <p>
                <strong>Space Complexity:</strong> {algorithm?.complexity.space}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
