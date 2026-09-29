import Navbar from '@/components/Navbar'

export default function ExploreLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/40 to-yellow-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 animate-pulse">
        {/* Explore Header Skeleton */}
        <div className="text-center mb-6 sm:mb-8 flex flex-col items-center">
          <div className="h-6 w-36 bg-orange-200/70 rounded-full mb-3" />
          <div className="h-9 w-64 sm:w-96 bg-gray-200 rounded-xl mb-2" />
          <div className="h-4 w-72 sm:w-80 bg-gray-200/80 rounded-md" />
        </div>

        {/* Filter Controls Center Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-4 sm:p-6 mb-6">
          <div className="h-12 bg-gray-100 rounded-xl mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="h-11 bg-gray-100 rounded-xl" />
            <div className="h-11 bg-gray-100 rounded-xl" />
            <div className="h-11 bg-gray-100 rounded-xl" />
          </div>
          <div className="flex gap-2 overflow-hidden py-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-9 w-24 bg-gray-100 rounded-xl shrink-0" />
            ))}
          </div>
        </div>

        {/* Dishes Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-xs border border-gray-200/80 p-4 sm:p-5 flex flex-col justify-between h-40"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div className="h-5 w-36 bg-gray-200 rounded" />
                  <div className="h-5 w-12 bg-orange-100 rounded" />
                </div>
                <div className="h-4 w-28 bg-gray-100 rounded" />
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-8 w-24 bg-gray-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
