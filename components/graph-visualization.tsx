interface GraphVisualizationProps {
  graphData: {
    nodes: { id: number; x: number; y: number; label: string }[]
    edges: { from: number; to: number }[]
  }
  visited: Set<number>
  current: number | null
  stack: number[]
  queue: number[]
  visitOrder: number[]
  selectedAlgorithm: string
}

export function GraphVisualization({
  graphData,
  visited,
  current,
  stack,
  queue,
  visitOrder,
  selectedAlgorithm,
}: GraphVisualizationProps) {
  return (
    <div className="relative w-full h-96 bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200">
      <svg width="100%" height="100%" viewBox="0 0 600 400">
        {/* Render edges */}
        {graphData.edges?.map((edge, index) => {
          const fromNode = graphData.nodes?.find((n) => n.id === edge.from)
          const toNode = graphData.nodes?.find((n) => n.id === edge.to)
          if (!fromNode || !toNode) return null

          return (
            <g key={index}>
              <line x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} stroke={"#d1d5db"} strokeWidth={"3"} />
            </g>
          )
        })}

        {/* Render nodes */}
        {graphData.nodes?.map((node) => {
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
                <text x={node.x + 35} y={node.y - 25} textAnchor="middle" className="text-xs font-bold fill-green-700">
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
              [{stack.map((id) => graphData.nodes.find((n) => n.id === id)?.label).join(", ")}]
            </div>
          </div>
        )}
        {selectedAlgorithm === "bfs" && (
          <div>
            <div className="font-bold text-sm text-gray-700 mb-1">Queue (FIFO):</div>
            <div className="text-sm bg-blue-50 p-2 rounded border">
              [{queue.map((id) => graphData.nodes.find((n) => n.id === id)?.label).join(", ")}]
            </div>
          </div>
        )}
        {visitOrder.length > 0 && (
          <div className="mt-3">
            <div className="font-bold text-sm text-gray-700 mb-1">Visit Order:</div>
            <div className="text-sm bg-green-50 p-2 rounded border">
              {visitOrder.map((id) => graphData.nodes.find((n) => n.id === id)?.label).join(" → ")}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
