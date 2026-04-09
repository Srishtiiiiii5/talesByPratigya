import { useReadingProgress } from '../../hooks/useReadingProgress'

export default function ReadingProgressBar() {
  const progress = useReadingProgress()

  return (
    <div
      className="reading-progress"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  )
}
