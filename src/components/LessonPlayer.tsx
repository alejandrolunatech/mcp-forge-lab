// ─── LessonPlayer ────────────────────────────────────────────────────────────
//
// Renders the active lesson step:
//  • Title + region breadcrumb
//  • Description (Markdown-lite: backticks → <code>)
//  • Code block (if step.code is set)
//  • Command block (if step.command is set)
//  • Explanation panel (revealed after step is complete)
//  • Hint toggle
//  • Previous / Mark Complete / Next navigation bar

import { useState } from 'react'
import clsx from 'clsx'
import CodeBlock from './CodeBlock'
import MiniGame from './MiniGame'
import XPToast from './XPToast'
import { useAppSettings } from '../hooks/useAppSettings'
import { useAppContext } from '../context/AppContext'
import type { LessonPlayerControls } from '../hooks/useLessonPlayer'
import { resolveStep, resolveRegion, resolveWorld } from '../content/resolver'

interface LessonPlayerProps extends LessonPlayerControls {}

// ── Inline description renderer ──────────────────────────────────────────────
// Converts `backtick` spans to <code> elements — no external dep needed.
function renderDescription(text: string) {
  const parts = text.split(/(`[^`]+`)/)
  return parts.map((part, i) =>
    part.startsWith('`') && part.endsWith('`') ? (
      <code
        key={i}
        className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-sm text-sky-300"
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

// ── Component ────────────────────────────────────────────────────────────────

export default function LessonPlayer({
  state,
  next,
  previous,
  complete,
}: LessonPlayerProps) {
  const { t, osClass, language } = useAppSettings()
  const { lastAward } = useAppContext()
  const [hintOpen, setHintOpen] = useState(false)

  // Reset hint when step changes
  const stepId = state?.step.id
  if (!hintOpen && stepId) {
    // intentionally no effect — just resets when stepId changes via key below
  }

  if (!state) {
    return (
      <div className="flex h-full items-center justify-center text-gray-600">
        {t('lesson.loading')}
      </div>
    )
  }

  const { step: rawStep, region: rawRegion, isFirst, isLast, isCurrentStepComplete } = state
  const step = resolveStep(rawStep, language)
  const region = resolveRegion(rawRegion, language)
  const world = resolveWorld(state.world, language)

  return (
    <div key={stepId} className="flex h-full flex-col gap-6 max-w-3xl mx-auto">
      {/* ── XP toast (position:fixed, renders above everything) ────────── */}
      {lastAward && <XPToast key={lastAward.timestamp} award={lastAward.award} />}
      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>{world.title}</span>
        <span>›</span>
        <span className="text-gray-400">{region.title}</span>
      </div>

      {/* ── Step header ────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3">
        {isCurrentStepComplete && (
          <span className="mt-1 flex-shrink-0 text-emerald-400 text-lg" aria-label="Complete">
            ✓
          </span>
        )}
        <h2 className="text-2xl font-bold tracking-tight text-gray-100">
          {step.title}
        </h2>
      </div>

      {/* ── Description ────────────────────────────────────────────────────── */}
      <p className="text-base text-gray-400 leading-relaxed">
        {renderDescription(step.description)}
      </p>

      {/* ── Code block ─────────────────────────────────────────────────────── */}
      {step.code && (
        <CodeBlock code={step.code} variant="code" />
      )}

      {/* ── Command block ───────────────────────────────────────────────────── */}
      {step.command && (
        <CodeBlock code={step.command} variant="command" />
      )}

      {/* ── Explanation (revealed after complete) ──────────────────────────── */}
      {isCurrentStepComplete && step.explanation && (
        <div
          className={clsx(
            'border border-emerald-900/50 bg-emerald-950/30 p-4 text-sm text-emerald-300 leading-relaxed',
            osClass('rounded-lg', 'rounded-none border-l-4 border-l-emerald-500'),
          )}
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-500">
            {t('lesson.explanation')}
          </p>
          {renderDescription(step.explanation)}
        </div>
      )}

      {/* ── Hint ────────────────────────────────────────────────────────────── */}
      {step.hint && (
        <div>
          <button
            onClick={() => setHintOpen(o => !o)}
            className={clsx(
              'flex items-center gap-2 text-xs font-medium text-amber-400 transition-colors hover:text-amber-300',
            )}
          >
            <span>{hintOpen ? '▾' : '▸'}</span>
            {hintOpen ? t('lesson.hideHint') : t('lesson.showHint')}
          </button>
          {hintOpen && (
            <div
              className={clsx(
                'mt-2 border border-amber-900/50 bg-amber-950/30 p-4 text-sm text-amber-200 leading-relaxed',
                osClass('rounded-lg', 'rounded-none border-l-4 border-l-amber-500'),
              )}
            >
              {renderDescription(step.hint)}
            </div>
          )}
        </div>
      )}

      {/* ── Mini-game challenge (if one is registered for this step) ───────── */}
      <MiniGame stepId={step.id} />

      {/* ── Navigation bar ──────────────────────────────────────────────────── */}
      <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-gray-800">
        {/* Previous */}
        <button
          onClick={previous}
          disabled={isFirst}
          className={clsx(
            'flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all duration-150',
            osClass('rounded-lg', 'rounded-none'),
            isFirst
              ? 'cursor-not-allowed text-gray-700'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-100',
          )}
        >
          ← {t('lesson.previous')}
        </button>

        {/* Mark complete */}
        <button
          onClick={complete}
          disabled={isCurrentStepComplete}
          className={clsx(
            'flex items-center gap-1.5 px-5 py-2 text-sm font-bold transition-all duration-150',
            osClass('rounded-lg', 'rounded-none'),
            isCurrentStepComplete
              ? 'cursor-default bg-emerald-900/40 text-emerald-500'
              : 'bg-emerald-500 text-gray-950 hover:bg-emerald-400 active:scale-95',
          )}
        >
          {isCurrentStepComplete ? `✓ ${t('lesson.completed')}` : t('lesson.markComplete')}
        </button>

        {/* Next */}
        <button
          onClick={next}
          disabled={isLast}
          className={clsx(
            'flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all duration-150',
            osClass('rounded-lg', 'rounded-none'),
            isLast
              ? 'cursor-not-allowed text-gray-700'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-100',
          )}
        >
          {t('lesson.next')} →
        </button>
      </div>
    </div>
  )
}
