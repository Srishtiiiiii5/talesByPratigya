export function CardSkeleton() {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="skeleton h-52 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-1/3 rounded" />
        <div className="skeleton h-6 w-3/4 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-5/6 rounded" />
        <div className="skeleton h-4 w-1/4 rounded mt-4" />
      </div>
    </div>
  )
}

export function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ReaderSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 space-y-5">
      <div className="skeleton h-10 w-3/4 rounded" />
      <div className="skeleton h-4 w-1/3 rounded" />
      <div className="space-y-3 mt-8">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`skeleton h-4 rounded ${i % 5 === 4 ? 'w-2/3' : 'w-full'}`} />
        ))}
      </div>
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 space-y-6">
      <div className="skeleton h-72 w-full rounded-2xl" />
      <div className="skeleton h-10 w-2/3 rounded" />
      <div className="skeleton h-5 w-1/3 rounded" />
      <div className="flex gap-3">
        {[1, 2, 3].map(i => <div key={i} className="skeleton h-8 w-20 rounded-full" />)}
      </div>
    </div>
  )
}
