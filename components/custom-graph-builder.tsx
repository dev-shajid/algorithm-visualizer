"use client"

import type React from "react"

import { Plus, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface CustomGraphBuilderProps {
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
}

export function CustomGraphBuilder({
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
}: CustomGraphBuilderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Build Your Graph</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Examples */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Quick Examples:</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={() => loadExampleGraph("simple")} variant="outline" size="sm" className="text-xs">
              Simple
            </Button>
            <Button onClick={() => loadExampleGraph("tree")} variant="outline" size="sm" className="text-xs">
              Tree
            </Button>
            <Button onClick={() => loadExampleGraph("cycle")} variant="outline" size="sm" className="text-xs">
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
                  <button onClick={() => removeCustomNode(node.id)} className="hover:bg-blue-200 rounded-full p-0.5">
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
              <Button onClick={addCustomEdge} size="sm" disabled={!newEdgeFrom.trim() || !newEdgeTo.trim()}>
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
                  <div key={index} className="flex items-center justify-between bg-gray-100 px-2 py-1 rounded text-sm">
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
  )
}
