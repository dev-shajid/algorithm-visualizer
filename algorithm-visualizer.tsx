"use client"

import { useState, useEffect, useCallback } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Sidebar } from "@/components/sidebar"
import { MainContent } from "@/components/main-content"

const AlgorithmVisualizer = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("dfs")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [speed, setSpeed] = useState([500])
  const [steps, setSteps] = useState([])
  const [showComplexityAnalysis, setShowComplexityAnalysis] = useState(false)
  const [showStepByStep, setShowStepByStep] = useState(true)
  const [showCode, setShowCode] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(false)

  // Graph data and custom input
  const [graphData, setGraphData] = useState({
    nodes: [],
    edges: [],
  })
  const [customNodes, setCustomNodes] = useState([])
  const [customEdges, setCustomEdges] = useState([])
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
    const nodes = [
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
  const addCustomNode = useCallback(() => {
    if (!newNodeName.trim()) return

    const existingNode = customNodes.find((node) => node.label.toLowerCase() === newNodeName.trim().toLowerCase())
    if (existingNode) return // Don't add duplicate nodes

    const newNode = {
      id: customNodes.length,
      label: newNodeName.trim(),
      x: 300 + (Math.random() - 0.5) * 200, // Placeholder for initial positioning
      y: 200 + (Math.random() - 0.5) * 150, // Placeholder for initial positioning
    }

    setCustomNodes((prev) => [...prev, newNode])
    setNewNodeName("")
  }, [newNodeName, customNodes])

  // Remove a node from custom graph
  const removeCustomNode = useCallback((nodeId) => {
    setCustomNodes((prev) => prev.filter((node) => node.id !== nodeId))
    setCustomEdges((prev) => prev.filter((edge) => edge.from !== nodeId && edge.to !== nodeId))
  }, [])

  // Add a new edge to custom graph
  const addCustomEdge = useCallback(() => {
    if (!newEdgeFrom.trim() || !newEdgeTo.trim()) return

    const fromNode = customNodes.find((node) => node.label.toLowerCase() === newEdgeFrom.trim().toLowerCase())
    const toNode = customNodes.find((node) => node.label.toLowerCase() === newEdgeTo.trim().toLowerCase())

    if (!fromNode || !toNode) return

    // Check if edge already exists (undirected for simplicity here)
    const existingEdge = customEdges.find(
      (edge) =>
        (edge.from === fromNode.id && edge.to === toNode.id) || (edge.from === toNode.id && edge.to === fromNode.id),
    )
    if (existingEdge) return

    const newEdge = {
      from: fromNode.id,
      to: toNode.id,
    }

    setCustomEdges((prev) => [...prev, newEdge])
    setNewEdgeFrom("")
    setNewEdgeTo("")
  }, [newEdgeFrom, newEdgeTo, customNodes, customEdges])

  // Remove an edge from custom graph
  const removeCustomEdge = useCallback((edgeIndex) => {
    setCustomEdges((prev) => prev.filter((_, index) => index !== edgeIndex))
  }, [])

  // Apply custom graph
  const applyCustomGraph = useCallback(() => {
    if (customNodes.length === 0) return

    // Position nodes in a circle
    const numNodes = customNodes.length
    const radius = Math.min(150, 100 + numNodes * 5) // Adjust radius based on number of nodes
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
        y: centerY + Math.sin(angle),
      }
    })

    setGraphData({ nodes: positionedNodes, edges: customEdges })
    setIsCustomGraph(true)
    setSteps([])
    setCurrentStep(0)
  }, [customNodes, customEdges])

  // Reset to default graph
  const resetToDefaultGraph = useCallback(() => {
    setIsCustomGraph(false)
    setCustomNodes([])
    setCustomEdges([])
    setNewNodeName("")
    setNewEdgeFrom("")
    setNewEdgeTo("")
    setGraphData(generateDefaultGraphData())
    setSteps([])
    setCurrentStep(0)
  }, [generateDefaultGraphData])

  // Load example graphs
  const loadExampleGraph = useCallback((type) => {
    let nodes = []
    let edges = []

    switch (type) {
      case "simple":
        nodes = [
          { id: 0, label: "A" },
          { id: 1, label: "B" },
          { id: 2, label: "C" },
        ]
        edges = [
          { from: 0, to: 1 },
          { from: 1, to: 2 },
        ]
        break
      case "tree":
        nodes = [
          { id: 0, label: "Root" },
          { id: 1, label: "L1" },
          { id: 2, label: "R1" },
          { id: 3, label: "L2" },
          { id: 4, label: "R2" },
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
          { id: 0, label: "A" },
          { id: 1, label: "B" },
          { id: 2, label: "C" },
          { id: 3, label: "D" },
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
  }, [])

  // Initialize data based on algorithm type or custom input
  useEffect(() => {
    if (!isCustomGraph) {
      setGraphData(generateDefaultGraphData())
    }
    setSteps([])
    setCurrentStep(0)
  }, [selectedAlgorithm, isCustomGraph, generateDefaultGraphData])

  // DFS Traversal
  const dfsTraversal = useCallback((graph) => {
    const steps = []
    const visited = new Set()
    const startNodeId = graph.nodes.length > 0 ? graph.nodes[0].id : 0
    const stack = [startNodeId]
    const visitOrder = []
    const startTime = performance.now()

    steps.push({
      graph,
      visited: new Set(),
      stack: [startNodeId],
      visitOrder: [],
      current: null,
      message: `Initialize DFS with starting node ${graph.nodes.find((n) => n.id === startNodeId)?.label} using a stack`,
      timestamp: performance.now() - startTime,
    })

    while (stack.length > 0) {
      const current = stack.pop()

      if (!visited.has(current)) {
        visited.add(current)
        visitOrder.push(current)

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
  }, [])

  // BFS Traversal
  const bfsTraversal = useCallback((graph) => {
    const steps = []
    const visited = new Set()
    const startNodeId = graph.nodes.length > 0 ? graph.nodes[0].id : 0
    const queue = [startNodeId]
    const visitOrder = []
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
      const current = queue.shift()

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
  }, [])

  const runAlgorithm = useCallback(() => {
    let algorithmSteps = []

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
  }, [selectedAlgorithm, graphData, dfsTraversal, bfsTraversal])

  const play = useCallback(() => {
    if (steps.length === 0) {
      runAlgorithm()
    }
    setIsPlaying(true)
  }, [steps.length, runAlgorithm])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const reset = useCallback(() => {
    setIsPlaying(false)
    setCurrentStep(0)
    setSteps([])
    if (!isCustomGraph) {
      setGraphData(generateDefaultGraphData())
    }
  }, [isCustomGraph, generateDefaultGraphData])

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }, [currentStep, steps.length])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  const jumpToEnd = useCallback(() => {
    if (steps.length > 0) {
      setCurrentStep(steps.length - 1)
      setIsPlaying(false)
    }
  }, [steps.length])

  const jumpToStart = useCallback(() => {
    setCurrentStep(0)
    setIsPlaying(false)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
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
  }, [isPlaying, currentStep, steps.length, play, pause, nextStep, prevStep, reset, jumpToStart, jumpToEnd])

  useEffect(() => {
    let interval
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
        <Sidebar
          algorithms={algorithms}
          selectedAlgorithm={selectedAlgorithm}
          setSelectedAlgorithm={setSelectedAlgorithm}
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
          speed={speed}
          setSpeed={setSpeed}
          isPlaying={isPlaying}
          play={play}
          pause={pause}
          reset={reset}
          currentStep={currentStep}
          stepsLength={steps.length}
          nextStep={nextStep}
          prevStep={prevStep}
          jumpToStart={jumpToStart}
          jumpToEnd={jumpToEnd}
          showStepByStep={showStepByStep}
          setShowStepByStep={setShowStepByStep}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          showComplexityAnalysis={showComplexityAnalysis}
          setShowComplexityAnalysis={setShowComplexityAnalysis}
          showCode={showCode}
          setShowCode={setShowCode}
        />
        <MainContent
          selectedAlgorithm={selectedAlgorithm}
          algorithms={algorithms}
          currentStepData={currentStepData}
          graphData={graphData}
          stepsLength={steps.length}
          currentStep={currentStep}
        />
      </div>
    </TooltipProvider>
  )
}

export default AlgorithmVisualizer
