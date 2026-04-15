import { useLessonPlayer } from '../hooks/useLessonPlayer'
import LessonNav from '../components/LessonNav'
import LessonPlayer from '../components/LessonPlayer'

export default function Lab() {
  const controls = useLessonPlayer()

  return (
    <div className="flex h-full gap-6 overflow-hidden">
      {/* Left nav panel */}
      <LessonNav controls={controls} />

      {/* Divider */}
      <div className="w-px flex-shrink-0 bg-gray-800" />

      {/* Main lesson player */}
      <div className="flex-1 overflow-y-auto py-1 pr-1">
        <LessonPlayer
          state={controls.state}
          next={controls.next}
          previous={controls.previous}
          complete={controls.complete}
          jumpTo={controls.jumpTo}
          completionPercent={controls.completionPercent}
        />
      </div>
    </div>
  )
}
