"use client"

import type React from "react"

import { Settings } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CustomGraphBuilder } from "./custom-graph-builder"
import { Controls } from "./controls"
import { AlgorithmInfo } from "./algorithm-info"

interface SidebarProps {
  algorithms: any
  selectedAlgorithm: string
  setSelectedAlgorithm: (algo: string) => void
  customNodes: { id: number; label: string; x?: number; y?: number }[]
  setCustomNodes: React.Dispatch<React.SetStateAction<{ id: number; label: string; x?: number; y?: number }[]>>
  customEdges: { from: number; to: number }[]
  setCustomEdges: React.Dispatch<React.SetStateAction<{ from: number; to: number }[]>>
  newNodeName: string
  setNewNodeName: React.Dispatch<React.SetStateAction<string>>
  newEdgeFrom: string
  setNewEdgeFrom: React.Dispatch<React.SetStateAction<string>>
  newEdgeTo: string
  setNewEdgeTo: React.Dispatch<React.SetStateAction<string>>
  addCustomNode: () => void
  removeCustomNode: (nodeId: number) => void
  addCustomEdge: () => void
  removeCustomEdge: (edgeIndex: number) => void
  applyCustomGraph: () => void
  resetToDefaultGraph: () => void
  loadExampleGraph: (type: string) => void
  speed: number[]
  setSpeed: (speed: number[]) => void
  isPlaying: boolean
  play: () => void
  pause: () => void
  reset: () => void
  currentStep: number
  stepsLength: number
  nextStep: () => void
  prevStep: () => void
  jumpToStart: () => void
  jumpToEnd: () => void
  showStepByStep: boolean
  setShowStepByStep: (show: boolean) => void
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  showComplexityAnalysis: boolean
  setShowComplexityAnalysis: (show: boolean) => void
  showCode: boolean
  setShowCode: (show: boolean) => void
}

export function Sidebar({
  algorithms,
  selectedAlgorithm,
  setSelectedAlgorithm,
  customNodes,
  setCustomNodes,
  customEdges,
  setCustomEdges,
  newNodeName,
  setNewNodeName,
  newEdgeFrom,
  setNewEdgeFrom,
  newEdgeTo,
  setNewEdgeTo,
  addCustomNode,
  removeCustomNode,
  addCustomEdge,
  removeCustomEdge,
  applyCustomGraph,
  resetToDefaultGraph,
  loadExampleGraph,
  speed,
  setSpeed,
  isPlaying,
  play,
  pause,
  reset,
  currentStep,
  stepsLength,
  nextStep,
  prevStep,
  jumpToStart,
  jumpToEnd,
  showStepByStep,
  setShowStepByStep,
  soundEnabled,
  setSoundEnabled,
  showComplexityAnalysis,
  setShowComplexityAnalysis,
  showCode,
  setShowCode,
}: SidebarProps) {
  return (
    <div className="w-80 bg-white shadow-2xl flex flex-col max-h-screen border-r">
      <div className="p-6 border-b border-gray-200 bg-blue-600 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Algorithm Visualizer</h1>
            <p className="text-sm text-blue-100">Interactive learning platform</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Algorithm Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
            <Settings className="mr-2" size={20} />
            Algorithms
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">Graph</h4>
              <div className="space-y-2">
                {Object.entries(algorithms)
                  .filter(([_, algo]) => algo.category === "Graph")
                  .map(([key, algo]) => (
                    <Card
                      key={key}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedAlgorithm === key ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedAlgorithm(key)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{algo.name}</h4>
                          <Badge variant={algo.difficulty === "Beginner" ? "default" : "secondary"}>
                            {algo.difficulty}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{algo.complexity.time}</p>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Graph Builder */}
        <CustomGraphBuilder
          customNodes={customNodes}
          setCustomNodes={setCustomNodes}
          customEdges={customEdges}
          setCustomEdges={setCustomEdges}
          newNodeName={newNodeName}
          setNewNodeName={setNewNodeName}
          newEdgeFrom={newEdgeFrom}
          setNewEdgeFrom={setNewEdgeFrom}
          newEdgeTo={newEdgeTo}
          setNewEdgeTo={setNewEdgeTo}
          addCustomNode={addCustomNode}
          removeCustomNode={removeCustomNode}
          addCustomEdge={addCustomEdge}
          removeCustomEdge={removeCustomEdge}
          applyCustomGraph={applyCustomGraph}
          resetToDefaultGraph={resetToDefaultGraph}
          loadExampleGraph={loadExampleGraph}
        />

        {/* Controls */}
        <Controls
          speed={speed}
          setSpeed={setSpeed}
          isPlaying={isPlaying}
          play={play}
          pause={pause}
          reset={reset}
          currentStep={currentStep}
          stepsLength={stepsLength}
          nextStep={nextStep}
          prevStep={prevStep}
          jumpToStart={jumpToStart}
          jumpToEnd={jumpToEnd}
          showStepByStep={showStepByStep}
          setShowStepByStep={setShowStepByStep}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
        />

        {/* Algorithm Info */}
        <AlgorithmInfo
          algorithm={algorithms[selectedAlgorithm]}
          showCode={showCode}
          setShowCode={setShowCode}
          showComplexityAnalysis={showComplexityAnalysis}
          setShowComplexityAnalysis={setShowComplexityAnalysis}
        />
      </div>
    </div>
  )
}
