"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  ChevronRight,
  Shuffle,
  SkipForward,
  SkipBack,
  Eye,
  EyeOff,
  BookOpen,
  Share2,
  Download,
  Plus,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type Node = {
  id: number
  label: string
  x: number
  y: number
}

type Edge = {
  from: number
  to: number
}

type Graph = {
  nodes: Node[]
  edges: Edge[]
}

type Step = {
  graph: Graph
  visited?: Set<number>
  stack?: number[]
  queue?: number[]
  visitOrder?: number[]
  current?: number | null
  completed?: boolean
  message?: string
  timestamp?: number
  totalTime?: number
  comparisons?: number
}

type AlgorithmKey = "dfs" | "bfs"

type AlgorithmInfo = {
  name: string
  category: string
  complexity: { time: string; space: string }
  type: string
  description: string
  difficulty: string
  code: string
}

const AlgorithmVisualizer = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmKey>("dfs")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [speed, setSpeed] = useState([500])
  const [steps, setSteps] = useState<Step[]>([])
  const [showComplexityAnalysis, setShowComplexityAnalysis] = useState(false)
  const [showStepByStep, setShowStepByStep] = useState(true)
  const [showCode, setShowCode] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)

  // Graph data and custom input
  const [graphData, setGraphData] = useState<{nodes:Node[], edges:Edge[]}>({ nodes: [], edges: [] })
  const [customNodes, setCustomNodes] = useState<Node[]>([])
  const [customEdges, setCustomEdges] = useState<Edge[]>([])
  const [isCustomGraph, setIsCustomGraph] = useState(false)
  const [newNodeName, setNewNodeName] = useState("")
  const [newEdgeFrom, setNewEdgeFrom] = useState("")
  const [newEdgeTo, setNewEdgeTo] = useState("")

  const algorithms = {
    dfs: {
      name: "Depth-First Search",
      category: "Graph",
      complexity: { time: "O(V + E)", space: "O(V)" },
      type: "graph",
      description: "Explores graph by going as deep as possible before backtracking",
      difficulty: "Intermediate",
      code: `function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}`,
    },
    bfs: {
      name: "Breadth-First Search",
      category: "Graph",
      complexity: { time: "O(V + E)", space: "O(V)" },
      type: "graph",
      description: "Explores graph level by level using a queue",
      difficulty: "Intermediate",
      code: `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  while (queue.length > 0) {
    const node = queue.shift();
    if (!visited.has(node)) {
      visited.add(node);
      console.log(node);
      queue.push(...graph[node].filter(n => !visited.has(n)));
    }
  }
}`,
    },
  }

  // Generate default graph data
  const generateDefaultGraphData = useCallback(() => {
    const nodes:Node[] = [
      { id: 0, x: 300, y: 80, label: "A" },
      { id: 1, x: 200, y: 160, label: "B" },
      { id: 2, x: 400, y: 160, label: "C" },
      { id: 3, x: 120, y: 240, label: "D" },
      { id: 4, x: 280, y: 240, label: "E" },
      { id: 5, x: 360, y: 240, label: "F" },
      { id: 6, x: 480, y: 240, label: "G" },
      { id: 7, x: 200, y: 320, label: "H" },
      { id: 8, x: 400, y: 320, label: "I" },
    ]

    const edges = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 2, to: 6 },
      { from: 3, to: 7 },
      { from: 4, to: 7 },
      { from: 5, to: 8 },
      { from: 6, to: 8 },
      { from: 4, to: 5 },
    ]

    return { nodes, edges }
  }, [])

  // Add a new node to custom graph
  const addCustomNode = () => {
    if (!newNodeName.trim()) return
    
    const existingNode = customNodes.find(node => node.label.toLowerCase() === newNodeName.trim().toLowerCase())
    if (existingNode) return // Don't add duplicate nodes
    
    const newNode = {
      id: customNodes.length,
      label: newNodeName.trim(),
      x: 300 + (Math.random() - 0.5) * 200,
      y: 200 + (Math.random() - 0.5) * 150,
    }
    
    setCustomNodes([...customNodes, newNode])
    setNewNodeName("")
  }

  // Remove a node from custom graph
  const removeCustomNode = (nodeId:string | number) => {
    setCustomNodes(customNodes.filter(node => node.id !== nodeId))
    setCustomEdges(customEdges.filter(edge => edge.from !== nodeId && edge.to !== nodeId))
  }

  // Add a new edge to custom graph
  const addCustomEdge = () => {
    if (!newEdgeFrom.trim() || !newEdgeTo.trim()) return
    
    const fromNode = customNodes.find(node => node.label.toLowerCase() === newEdgeFrom.trim().toLowerCase())
    const toNode = customNodes.find(node => node.label.toLowerCase() === newEdgeTo.trim().toLowerCase())
    
    if (!fromNode || !toNode) return
    
    // Check if edge already exists
    const existingEdge = customEdges.find(edge => 
      (edge.from === fromNode.id && edge.to === toNode.id) ||
      (edge.from === toNode.id && edge.to === fromNode.id)
    )
    if (existingEdge) return
    
    const newEdge = {
      from: fromNode.id,
      to: toNode.id,
    }
    
    setCustomEdges([...customEdges, newEdge])
    setNewEdgeFrom("")
    setNewEdgeTo("")
  }

  // Remove an edge from custom graph
  const removeCustomEdge = (edgeIndex:number) => {
    setCustomEdges(customEdges.filter((_, index) => index !== edgeIndex))
  }

  // Apply custom graph
  const applyCustomGraph = () => {
    if (customNodes.length === 0) return
    
    // Position nodes in a circle
    const numNodes = customNodes.length
    const radius = Math.min(150, 100 + numNodes * 5)
    const centerX = 300
    const centerY = 200

    const positionedNodes = customNodes.map((node, index) => {
      if (numNodes === 1) {
        return { ...node, x: centerX, y: centerY }
      }
      const angle = (index / numNodes) * 2 * Math.PI
      return {
        ...node,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      }
    })

    setGraphData({ nodes: positionedNodes, edges: customEdges })
    setIsCustomGraph(true)
    setSteps([])
    setCurrentStep(0)
  }

  // Reset to default graph
  const resetToDefaultGraph = () => {
    setIsCustomGraph(false)
    setCustomNodes([])
    setCustomEdges([])
    setNewNodeName("")
    setNewEdgeFrom("")
    setNewEdgeTo("")
    setGraphData(generateDefaultGraphData())
    setSteps([])
    setCurrentStep(0)
  }

  // Load example graphs
  const loadExampleGraph = (type: string) => {
    let nodes: Node[] = []
    let edges: Edge[] = []

    switch (type) {
      case "simple":
        nodes = [
          { id: 0, label: "A", x: 300, y: 200 },
          { id: 1, label: "B", x: 500, y: 200 },
          { id: 2, label: "C", x: 400, y: 300 },
        ]
        edges = [
          { from: 0, to: 1 },
          { from: 1, to: 2 },
        ]
        break
      case "tree":
        nodes = [
          { id: 0, label: "Root", x: 300, y: 50 },
          { id: 1, label: "L1", x: 200, y: 100 },
          { id: 2, label: "R1", x: 400, y: 100 },
          { id: 3, label: "L2", x: 150, y: 150 },
          { id: 4, label: "R2", x: 350, y: 150 },
        ]
        edges = [
          { from: 0, to: 1 },
          { from: 0, to: 2 },
          { from: 1, to: 3 },
          { from: 1, to: 4 },
        ]
        break
      case "cycle":
        nodes = [
          { id: 0, label: "A", x: 300, y: 100 },
          { id: 1, label: "B", x: 500, y: 100 },
          { id: 2, label: "C", x: 400, y: 200 },
          { id: 3, label: "D", x: 300, y: 200 },
        ]
        edges = [
          { from: 0, to: 1 },
          { from: 1, to: 2 },
          { from: 2, to: 3 },
          { from: 3, to: 0 },
        ]
        break
    }
    
    setCustomNodes(nodes)
    setCustomEdges(edges)
  }

  // Initialize data
  useEffect(() => {
    if (!isCustomGraph) {
      setGraphData(generateDefaultGraphData())
    }
    setSteps([])
    setCurrentStep(0)
  }, [selectedAlgorithm, isCustomGraph, generateDefaultGraphData])

  // DFS Traversal
  const dfsTraversal = (graph: Graph) => {
    const steps: Step[] = []
    const visited: Set<number> = new Set()
    const startNodeId = graph.nodes.length > 0 ? graph.nodes[0].id : 0
    const stack = [startNodeId]
    const visitOrder = []
    const startTime = performance.now()

    steps.push({
      graph,
      visited: new Set(),
      stack: [startNodeId],
      visitOrder: [] as number[],
      current: null,
      message: `Initialize DFS with starting node ${graph.nodes.find((n) => n.id === startNodeId)?.label} using a stack`,
      timestamp: performance.now() - startTime,
    })

    while (stack.length > 0) {
      const current = stack.pop()

      if (!visited.has(current as number)) {
        visited.add(current as number)
        visitOrder.push(current as number)

        steps.push({
          graph,
          visited: new Set(visited),
          stack: [...stack],
          visitOrder: [...visitOrder],
          current,
          message: `Visit node ${graph.nodes.find((n) => n.id === current)?.label} - mark as visited`,
          timestamp: performance.now() - startTime,
        })

        const neighbors = graph.edges
          .filter((edge) => edge.from === current)
          .map((edge) => edge.to)
          .filter((neighbor) => !visited.has(neighbor))
          .sort((a, b) => b - a)

        for (const neighbor of neighbors) {
          if (!stack.includes(neighbor)) {
            stack.push(neighbor)
          }
        }

        if (neighbors.length > 0) {
          steps.push({
            graph,
            visited: new Set(visited),
            stack: [...stack],
            visitOrder: [...visitOrder],
            current,
            message: `Added unvisited neighbors of ${graph.nodes.find((n) => n.id === current)?.label} to stack: [${neighbors.map((n) => graph.nodes.find((node) => node.id === n)?.label).join(", ")}]`,
            timestamp: performance.now() - startTime,
          })
        }
      }
    }

    const endTime = performance.now()
    steps.push({
      graph,
      visited: new Set(visited),
      stack: [],
      visitOrder: [...visitOrder],
      completed: true,
      message: `DFS completed! Visit order: [${visitOrder.map((id) => graph.nodes.find((n) => n.id === id)?.label).join(" → ")}]`,
      timestamp: endTime - startTime,
      totalTime: endTime - startTime,
    })

    return steps
  }

  // BFS Traversal
  const bfsTraversal = (graph: Graph) => {
    const steps: Step[] = []
    const visited: Set<number> = new Set()
    const startNodeId = graph.nodes.length > 0 ? graph.nodes[0].id : 0
    const queue: number[] = [startNodeId]
    const visitOrder: number[] = []
    const startTime = performance.now()

    steps.push({
      graph,
      visited: new Set(),
      queue: [startNodeId],
      visitOrder: [],
      current: null,
      message: `Initialize BFS with starting node ${graph.nodes.find((n) => n.id === startNodeId)?.label} using a queue`,
      timestamp: performance.now() - startTime,
    })

    while (queue.length > 0) {
      const current = queue.shift() as number

      if (!visited.has(current)) {
        visited.add(current)
        visitOrder.push(current)

        steps.push({
          graph,
          visited: new Set(visited),
          queue: [...queue],
          visitOrder: [...visitOrder],
          current,
          message: `Visit node ${graph.nodes.find((n) => n.id === current)?.label} - mark as visited`,
          timestamp: performance.now() - startTime,
        })

        const neighbors = graph.edges
          .filter((edge) => edge.from === current)
          .map((edge) => edge.to)
          .filter((neighbor) => !visited.has(neighbor) && !queue.includes(neighbor))
          .sort((a, b) => a - b)

        for (const neighbor of neighbors) {
          queue.push(neighbor)
        }

        if (neighbors.length > 0) {
          steps.push({
            graph,
            visited: new Set(visited),
            queue: [...queue],
            visitOrder: [...visitOrder],
            current,
            message: `Added unvisited neighbors of ${graph.nodes.find((n) => n.id === current)?.label} to queue: [${neighbors.map((n) => graph.nodes.find((node) => node.id === n)?.label).join(", ")}]`,
            timestamp: performance.now() - startTime,
          })
        }
      }
    }

    const endTime = performance.now()
    steps.push({
      graph,
      visited: new Set(visited),
      queue: [],
      visitOrder: [...visitOrder],
      completed: true,
      message: `BFS completed! Visit order: [${visitOrder.map((id) => graph.nodes.find((n) => n.id === id)?.label).join(" → ")}]`,
      timestamp: endTime - startTime,
      totalTime: endTime - startTime,
    })

    return steps
  }

  const runAlgorithm = () => {
    let algorithmSteps: Step[] = []

    switch (selectedAlgorithm) {
      case "dfs":
        algorithmSteps = dfsTraversal(graphData)
        break
      case "bfs":
        algorithmSteps = bfsTraversal(graphData)
        break
      default:
        algorithmSteps = dfsTraversal(graphData)
    }

    setSteps(algorithmSteps)
    setCurrentStep(0)
  }

  const play = () => {
    if (steps.length === 0) {
      runAlgorithm()
    }
    setIsPlaying(true)
  }

  const pause = () => {
    setIsPlaying(false)
  }

  const reset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setSteps([])
    if (!isCustomGraph) {
      setGraphData(generateDefaultGraphData())
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const jumpToEnd = () => {
    if (steps.length > 0) {
      setCurrentStep(steps.length - 1)
      setIsPlaying(false)
    }
  }

  const jumpToStart = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case " ":
          event.preventDefault()
          isPlaying ? pause() : play()
          break
        case "ArrowRight":
          event.preventDefault()
          nextStep()
          break
        case "ArrowLeft":
          event.preventDefault()
          prevStep()
          break
        case "r":
          event.preventDefault()
          reset()
          break
        case "Home":
          event.preventDefault()
          jumpToStart()
          break
        case "End":
          event.preventDefault()
          jumpToEnd()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isPlaying, currentStep, steps.length])

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined
    if (isPlaying && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, speed[0])
    } else {
      setIsPlaying(false)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentStep, steps.length, speed])

  const currentStepData = steps[currentStep] || {}

  const renderGraphVisualization = () => {
    const graph = currentStepData.graph || graphData
    const visited = currentStepData.visited || new Set()
    const current = currentStepData.current
    const stack = currentStepData.stack || []
    const queue = currentStepData.queue || []
    const visitOrder = currentStepData.visitOrder || []

    return (
      <div className="relative w-full h-96 bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
        <svg width="100%" height="100%" viewBox="0 0 600 400">
          {/* Render edges */}
          {graph.edges?.map((edge, index) => {
            const fromNode = graph.nodes?.find((n) => n.id === edge.from)
            const toNode = graph.nodes?.find((n) => n.id === edge.to)
            if (!fromNode || !toNode) return null

            return (
              <g key={index}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={"#d1d5db"}
                  strokeWidth={"3"}
                />
              </g>
            )
          })}

          {/* Render nodes */}
          {graph.nodes?.map((node) => {
            const isVisited = visited.has(node.id)
            const isCurrent = current === node.id
            const isInDataStructure = stack.includes(node.id) || queue.includes(node.id)

            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="28"
                  className={`transition-all duration-500 drop-shadow-lg ${
                    isCurrent
                      ? "fill-yellow-400 stroke-yellow-600"
                      : isVisited
                        ? "fill-green-400 stroke-green-600"
                        : isInDataStructure
                          ? "fill-blue-300 stroke-blue-500"
                          : "fill-white stroke-gray-400"
                  }`}
                  strokeWidth="3"
                />
                <text x={node.x} y={node.y + 6} textAnchor="middle" className="text-lg font-bold fill-gray-800">
                  {node.label}
                </text>
                {/* Visit order indicator */}
                {isVisited && visitOrder.includes(node.id) && (
                  <text
                    x={node.x + 35}
                    y={node.y - 25}
                    textAnchor="middle"
                    className="text-xs font-bold fill-green-700"
                  >
                    {visitOrder.indexOf(node.id) + 1}
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {/* Data structure display */}
        <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
          {selectedAlgorithm === "dfs" && (
            <div>
              <div className="font-bold text-sm text-gray-700 mb-1">Stack (LIFO):</div>
              <div className="text-sm bg-blue-50 p-2 rounded border">
                [{stack.map((id) => graph.nodes.find((n) => n.id === id)?.label).join(", ")}]
              </div>
            </div>
          )}
          {selectedAlgorithm === "bfs" && (
            <div>
              <div className="font-bold text-sm text-gray-700 mb-1">Queue (FIFO):</div>
              <div className="text-sm bg-blue-50 p-2 rounded border">
                [{queue.map((id) => graph.nodes.find((n) => n.id === id)?.label).join(", ")}]
              </div>
            </div>
          )}
          {visitOrder.length > 0 && (
            <div className="mt-3">
              <div className="font-bold text-sm text-gray-700 mb-1">Visit Order:</div>
              <div className="text-sm bg-green-50 p-2 rounded border">
                {visitOrder.map((id) => graph.nodes.find((n) => n.id === id)?.label).join(" → ")}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-blue-50 flex">
        {/* Sidebar */}
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
                          onClick={() => setSelectedAlgorithm(key as AlgorithmKey)}
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Build Your Graph</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Examples */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Quick Examples:</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => loadExampleGraph("simple")}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Simple
                    </Button>
                    <Button
                      onClick={() => loadExampleGraph("tree")}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Tree
                    </Button>
                    <Button
                      onClick={() => loadExampleGraph("cycle")}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Cycle
                    </Button>
                  </div>
                </div>

                {/* Add Nodes */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Add Node:</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newNodeName}
                      onChange={(e) => setNewNodeName(e.target.value)}
                      placeholder="Node name (e.g., A)"
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && addCustomNode()}
                    />
                    <Button onClick={addCustomNode} size="sm" disabled={!newNodeName.trim()}>
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>

                {/* Current Nodes */}
                {customNodes.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Nodes:</Label>
                    <div className="flex flex-wrap gap-2">
                      {customNodes.map((node) => (
                        <div
                          key={node.id}
                          className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                        >
                          <span>{node.label}</span>
                          <button
                            onClick={() => removeCustomNode(node.id)}
                            className="hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Edges */}
                {customNodes.length >= 2 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Add Edge:</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newEdgeFrom}
                        onChange={(e) => setNewEdgeFrom(e.target.value)}
                        placeholder="From"
                        className="flex-1"
                        list="node-list-from"
                      />
                      <Input
                        value={newEdgeTo}
                        onChange={(e) => setNewEdgeTo(e.target.value)}
                        placeholder="To"
                        className="flex-1"
                        list="node-list-to"
                      />
                      <Button
                        onClick={addCustomEdge}
                        size="sm"
                        disabled={!newEdgeFrom.trim() || !newEdgeTo.trim()}
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    
                    {/* Datalists for autocomplete */}
                    <datalist id="node-list-from">
                      {customNodes.map((node) => (
                        <option key={node.id} value={node.label} />
                      ))}
                    </datalist>
                    <datalist id="node-list-to">
                      {customNodes.map((node) => (
                        <option key={node.id} value={node.label} />
                      ))}
                    </datalist>
                  </div>
                )}

                {/* Current Edges */}
                {customEdges.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Edges:</Label>
                    <div className="space-y-1">
                      {customEdges.map((edge, index) => {
                        const fromNode = customNodes.find((n) => n.id === edge.from)
                        const toNode = customNodes.find((n) => n.id === edge.to)
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded text-sm"
                          >
                            <span>
                              {fromNode?.label} → {toNode?.label}
                            </span>
                            <button
                              onClick={() => removeCustomEdge(index)}
                              className="hover:bg-red-200 rounded-full p-0.5 text-red-600"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Apply/Reset Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={applyCustomGraph}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={customNodes.length === 0}
                  >
                    Apply Graph
                  </Button>
                  <Button onClick={resetToDefaultGraph} variant="outline">
                    Use Default
                  </Button>
                </div>

                {/* Helper text */}
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <strong>Tips:</strong>
                  <br />• Add nodes first, then connect them with edges
                  <br />• Use simple names like A, B, C or 1, 2, 3
                  <br />• Type node names in edge fields for autocomplete
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Speed Control */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Speed:{" "}
                    {speed[0] < 200
                      ? "Very Fast"
                      : speed[0] < 400
                        ? "Fast"
                        : speed[0] < 600
                          ? "Medium"
                          : speed[0] < 800
                            ? "Slow"
                            : "Very Slow"}
                  </Label>
                  <Slider value={speed} onValueChange={setSpeed} max={1000} min={100} step={50} className="w-full" />
                </div>

                {/* Settings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="step-by-step" className="text-sm">
                      Step-by-step mode
                    </Label>
                    <Switch id="step-by-step" checked={showStepByStep} onCheckedChange={setShowStepByStep} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sound" className="text-sm">
                      Sound effects
                    </Label>
                    <Switch id="sound" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={jumpToStart} disabled={currentStep === 0} variant="outline" size="sm">
                        <SkipBack size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Jump to start (Home)</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={prevStep} disabled={currentStep <= 0} variant="outline" size="sm">
                        <ChevronRight size={16} className="rotate-180" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Previous step (←)</TooltipContent>
                  </Tooltip>

                  <Button onClick={isPlaying ? pause : play} className="col-span-2 bg-blue-600 hover:bg-blue-700">
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    <span className="ml-2">{isPlaying ? "Pause" : "Play"}</span>
                  </Button>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={nextStep} disabled={currentStep >= steps.length - 1} variant="outline" size="sm">
                        <ChevronRight size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Next step (→)</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={jumpToEnd}
                        disabled={currentStep >= steps.length - 1 || steps.length === 0}
                        variant="outline"
                        size="sm"
                      >
                        <SkipForward size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Jump to end (End)</TooltipContent>
                  </Tooltip>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={reset} variant="destructive" size="sm">
                    <RotateCcw size={16} />
                    <span className="ml-2">Reset</span>
                  </Button>
                  <Button
                    onClick={() => {
                      resetToDefaultGraph()
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <Shuffle size={16} />
                    <span className="ml-2">New Data</span>
                  </Button>
                </div>

                {/* Keyboard shortcuts info */}
                <div className="text-xs text-gray-500 mt-4">
                  <div className="font-semibold mb-1">Keyboard Shortcuts:</div>
                  <div>Space: Play/Pause</div>
                  <div>← →: Previous/Next step</div>
                  <div>Home/End: Jump to start/end</div>
                  <div>R: Reset</div>
                </div>
              </CardContent>
            </Card>

            {/* Algorithm Info */}
            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {algorithms[selectedAlgorithm]?.name}
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowCode(!showCode)}>
                      {showCode ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowComplexityAnalysis(!showComplexityAnalysis)}
                    >
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
                      {algorithms[selectedAlgorithm]?.complexity.time}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Space:</span>
                    <Badge variant="outline" className="ml-2">
                      {algorithms[selectedAlgorithm]?.complexity.space}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{algorithms[selectedAlgorithm]?.description}</p>

                {showCode && (
                  <div className="mt-4">
                    <pre className="bg-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                      <code>{algorithms[selectedAlgorithm]?.code}</code>
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
                        <strong>Average Case:</strong> {algorithms[selectedAlgorithm]?.complexity.time}
                      </p>
                      <p>
                        <strong>Worst Case:</strong> {algorithms[selectedAlgorithm]?.complexity.time}
                      </p>
                      <p>
                        <strong>Space Complexity:</strong> {algorithms[selectedAlgorithm]?.complexity.space}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 flex flex-col">
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
              {renderGraphVisualization()}
            </CardContent>

            {/* Progress Bar and Statistics */}
            <CardContent className="border-t bg-gray-50">
              {steps.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Progress</span>
                    <span className="font-mono text-sm">
                      {currentStep + 1} / {steps.length}
                    </span>
                  </div>

                  <Progress value={((currentStep + 1) / steps.length) * 100} className="h-3" />

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
        </div>
      </div>
    </TooltipProvider>
  )
}

export default AlgorithmVisualizer
