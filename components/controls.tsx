"use client"

import { Play, Pause, RotateCcw, ChevronRight, Shuffle, SkipForward, SkipBack } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface ControlsProps {
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
}

export function Controls({
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
}: ControlsProps) {
  return (
    <TooltipProvider>
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
                <Button onClick={nextStep} disabled={currentStep >= stepsLength - 1} variant="outline" size="sm">
                  <ChevronRight size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next step (→)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={jumpToEnd}
                  disabled={currentStep >= stepsLength - 1 || stepsLength === 0}
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
            <Button onClick={reset} variant="outline" size="sm">
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
    </TooltipProvider>
  )
}
