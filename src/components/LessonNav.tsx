// ─── LessonNav ───────────────────────────────────────────────────────────────
//
// Left panel inside the Lab page.  Shows:
//  • All worlds with their regions collapsed/expanded
//  • Per-region step list with completion checkmarks
//  • Overall world progress bar + percentage

import clsx from 'clsx'
import { useState } from 'react'
import { lessonEngine } from '../engine/lessonEngine'
import { progressEngine } from '../engine/progressEngine'
import { useAppSettings } from '../hooks/useAppSettings'
import type { LessonPlayerControls } from '../hooks/useLessonPlayer'
import { ALL_WORLDS } from '../content/worlds'
import { resolveWorld, resolveRegion, resolveStep } from '../content/resolver'

interface LessonNavProps {
  controls: LessonPlayerControls
}

export default function LessonNav({ controls }: LessonNavProps) {
  const { t, osClass, language } = useAppSettings()
  const { state, jumpTo, completionPercent } = controls

  // Track which regions are expanded (default: expand the active one)
  const [openRegions, setOpenRegions] = useState<Set<string>>(() => {
    const initial = new Set<string>()
    if (state?.region.id) initial.add(state.region.id)
    return initial
  })

  function toggleRegion(regionId: string) {
    setOpenRegions(prev => {
      const next = new Set(prev)
      next.has(regionId) ? next.delete(regionId) : next.add(regionId)
      return next
    })
  }

  return (
    <div className="flex w-60 flex-shrink-0 flex-col gap-4 overflow-y-auto">
      {ALL_WORLDS.map(world => {
        const resolvedWorld = resolveWorld(world, language)
        const totalSteps = lessonEngine.getTotalSteps(world.id)
        const percent = progressEngine.getCompletionPercent(world.id, totalSteps)
        // Use live completionPercent for the active world
        const displayPercent =
          state?.world.id === world.id ? completionPercent : percent

        return (
          <div key={world.id} className="space-y-3">
            {/* World header */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {resolvedWorld.title}
              </h3>
              {/* World progress bar */}
              <div className="flex items-center gap-2">
                <div
                  className={clsx(
                    'h-1.5 flex-1 overflow-hidden bg-gray-800',
                    osClass('rounded-full', 'rounded-none'),
                  )}
                >
                  <div
                    className={clsx(
                      'h-full bg-emerald-400 transition-all duration-500',
                      osClass('rounded-full', 'rounded-none'),
                    )}
                    style={{ width: `${displayPercent}%` }}
                    role="progressbar"
                    aria-valuenow={displayPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <span className="text-xs tabular-nums text-gray-500">
                  {displayPercent}%
                </span>
              </div>
            </div>

            {/* Regions */}
            <div className="space-y-1">
              {world.regions.map(region => {
                const resolvedRegion = resolveRegion(region, language)
                const isOpen = openRegions.has(region.id)
                const isActiveRegion = state?.region.id === region.id
                const completedInRegion = region.steps.filter(s =>
                  progressEngine.isStepComplete(world.id, s.id),
                ).length

                return (
                  <div key={region.id}>
                    {/* Region row */}
                    <button
                      onClick={() => toggleRegion(region.id)}
                      className={clsx(
                        'flex w-full items-center justify-between gap-2 px-2 py-1.5 text-left text-xs font-semibold transition-colors duration-150',
                        osClass('rounded-md', 'rounded-none'),
                        isActiveRegion
                          ? 'bg-gray-800 text-gray-200'
                          : 'text-gray-500 hover:bg-gray-800/60 hover:text-gray-300',
                      )}
                    >
                      <span className="truncate">{resolvedRegion.title}</span>
                      <span className="flex-shrink-0 tabular-nums text-gray-600">
                        {completedInRegion}/{region.steps.length}
                      </span>
                    </button>

                    {/* Steps list */}
                    {isOpen && (
                      <div className="mt-0.5 ml-2 space-y-0.5 border-l border-gray-800 pl-3">
                        {region.steps.map(step => {
                          const resolvedStep = resolveStep(step, language)
                          const isComplete = progressEngine.isStepComplete(
                            world.id,
                            step.id,
                          )
                          const isActive = state?.step.id === step.id

                          return (
                            <button
                              key={step.id}
                              onClick={() => jumpTo(world.id, step.id)}
                              className={clsx(
                                'flex w-full items-center gap-2 px-2 py-1 text-left text-xs transition-colors duration-150',
                                osClass('rounded-md', 'rounded-none'),
                                isActive
                                  ? 'bg-emerald-900/40 text-emerald-400'
                                  : isComplete
                                    ? 'text-gray-500 hover:text-gray-300'
                                    : 'text-gray-600 hover:text-gray-300',
                              )}
                            >
                              <span
                                className={clsx(
                                  'flex h-4 w-4 flex-shrink-0 items-center justify-center text-[10px] font-bold',
                                  osClass('rounded-full', 'rounded-none'),
                                  isComplete
                                    ? 'bg-emerald-500 text-gray-950'
                                    : isActive
                                      ? 'border border-emerald-500 text-emerald-400'
                                      : 'border border-gray-700 text-gray-600',
                                )}
                              >
                                {isComplete ? '✓' : ''}
                              </span>
                              <span className="truncate">{resolvedStep.title}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* Bottom hint */}
      <p className="mt-auto pt-4 text-xs text-gray-700">
        {t('lesson.navHint')}
      </p>
    </div>
  )
}
