import { Share2, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { GraphVisualization } from "./graph-visualization"

interface MainContentProps {
  selectedAlgorithm: string
  algorithms: any
  currentStepData: any
  graphData: {
    nodes: { id: number; x: number; y: number; label: string }[]
    edges: { from: number; to: number }[]
  }
  stepsLength: number
  currentStep: number
}

export function MainContent({
  selectedAlgorithm,
  algorithms,
  currentStepData,
  graphData,
  stepsLength,
  currentStep,
}: MainContentProps) {
  return (
    <div className="flex-1 p-6 flex flex-col">
      <TooltipProvider>
        <Card className="flex flex-col flex-1 shadow-2xl">
          {/* Header */}
          <CardHeader className="bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">{algorithms[selectedAlgorithm]?.name}</CardTitle>
                <p className="text-base text-gray-600 leading-relaxed">
                  {currentStepData.message || "Click Play to start the visualization"}
                </p>
              </div>
              <div className="flex gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Share2 size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share visualization</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Download size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Export data</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardHeader>

          {/* Visualization Area */}
          <CardContent className="flex-1 p-6 flex items-center justify-center min-h-0">
            <GraphVisualization
              graphData={currentStepData.graph || graphData}
              visited={currentStepData.visited || new Set()}
              current={currentStepData.current}
              stack={currentStepData.stack || []}
              queue={currentStepData.queue || []}
              visitOrder={currentStepData.visitOrder || []}
              selectedAlgorithm={selectedAlgorithm}
            />
          </CardContent>

          {/* Progress Bar and Statistics */}
          <CardContent className="border-t bg-gray-50">
            {stepsLength > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Progress</span>
                  <span className="font-mono text-sm">
                    {currentStep + 1} / {stepsLength}
                  </span>
                </div>

                <Progress value={((currentStep + 1) / stepsLength) * 100} className="h-3" />

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {currentStepData.comparisons !== undefined && (
                    <Card className="p-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{currentStepData.comparisons}</div>
                        <div className="text-xs text-gray-600">Operations</div>
                      </div>
                    </Card>
                  )}
                  {currentStepData.timestamp !== undefined && (
                    <Card className="p-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {Math.round(currentStepData.timestamp)}ms
                        </div>
                        <div className="text-xs text-gray-600">Time Elapsed</div>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TooltipProvider>
    </div>
  )
}
