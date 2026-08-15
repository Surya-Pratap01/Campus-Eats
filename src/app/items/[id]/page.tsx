import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { notFound } from 'next/navigation'
import RatingForm from '@/components/RatingForm'
import ReportButton from '@/components/ReportButton'

async function getMenuItem(id: string) {
  const supabase = await createClient()
  const { data: menuItem, error } = await supabase
    .from('menu_items')
    .select(`
      *,
      outlets (*)
    `)
    .eq('id', id)
    .single()

  if (error || !menuItem) {
    return null
  }

  return menuItem
}

async function getRatings(menuItemId: string) {
  const supabase = await createClient()
  const { data: ratings } = await supabase
    .from('ratings')
    .select(`
      *,
      profiles (full_name, email)
    `)
    .eq('menu_item_id', menuItemId)
    .order('created_at', { ascending: false })

  return ratings || []
}

async function getUserRating(menuItemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: rating } = await supabase
    .from('ratings')
    .select('*')
    .eq('menu_item_id', menuItemId)
    .eq('student_id', user.id)
    .single()

  return rating
}

function calculateAverageRating(ratings: any[]) {
  if (!ratings || ratings.length === 0) return null

  const total = ratings.reduce((sum, rating) => {
    const avg = (rating.taste + rating.hygiene + rating.quantity + rating.value_for_money) / 4
    return sum + avg
  }, 0)

  return (total / ratings.length).toFixed(1)
}

function calculateDimensionAverage(ratings: any[], dimension: string) {
  if (!ratings || ratings.length === 0) return null

  const total = ratings.reduce((sum, rating) => sum + rating[dimension], 0)
  return (total / ratings.length).toFixed(1)
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= value ? 'text-yellow-500' : 'text-gray-300'}
        >
          ⭐
        </span>
      ))}
    </div>
  )
}

export default async function ItemPage({ params }: { params: { id: string } }) {
  const menuItem = await getMenuItem(params.id)
  
  if (!menuItem) {
    notFound()
  }

  const ratings = await getRatings(params.id)
  const userRating = await getUserRating(params.id)
  const avgRating = calculateAverageRating(ratings)

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href={`/outlets/${menuItem.outlet_id}`}
          className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium mb-6 transition"
        >
          ← Back to {menuItem.outlets.name}
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {menuItem.photo_url ? (
            <div className="h-64 overflow-hidden">
              <img
                src={menuItem.photo_url}
                alt={menuItem.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-64 bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center">
              <span className="text-8xl">🍽️</span>
            </div>
          )}
          
          <div className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{menuItem.name}</h1>
                <p className="text-gray-500">{menuItem.category}</p>
              </div>
              
              {menuItem.price && (
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-600">₹{menuItem.price}</p>
                </div>
              )}
            </div>

            {avgRating && (
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-yellow-500 text-2xl">⭐</span>
                <span className="text-2xl font-bold text-gray-900">{avgRating}</span>
                <span className="text-gray-500">({ratings.length} rating{ratings.length !== 1 ? 's' : ''})</span>
              </div>
            )}
          </div>
        </div>

        {/* Rating Breakdown */}
        {ratings.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Rating Breakdown</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Taste</p>
                <p className="text-2xl font-bold text-gray-900">
                  {calculateDimensionAverage(ratings, 'taste') || '-'}
                </p>
                <StarRating value={Math.round(Number(calculateDimensionAverage(ratings, 'taste') || 0))} />
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Hygiene</p>
                <p className="text-2xl font-bold text-gray-900">
                  {calculateDimensionAverage(ratings, 'hygiene') || '-'}
                </p>
                <StarRating value={Math.round(Number(calculateDimensionAverage(ratings, 'hygiene') || 0))} />
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Quantity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {calculateDimensionAverage(ratings, 'quantity') || '-'}
                </p>
                <StarRating value={Math.round(Number(calculateDimensionAverage(ratings, 'quantity') || 0))} />
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-1">Value for Money</p>
                <p className="text-2xl font-bold text-gray-900">
                  {calculateDimensionAverage(ratings, 'value_for_money') || '-'}
                </p>
                <StarRating value={Math.round(Number(calculateDimensionAverage(ratings, 'value_for_money') || 0))} />
              </div>
            </div>
          </div>
        )}

        {/* Rating Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {userRating ? 'Update Your Rating' : 'Rate This Item'}
          </h2>
          <RatingForm menuItemId={params.id} existingRating={userRating} />
        </div>

        {/* Ratings List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Student Reviews ({ratings.length})
          </h2>
          
          {ratings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">✨</div>
              <p className="text-gray-500">No ratings yet — be the first to try this!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ratings.map((rating) => (
                <div key={rating.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {rating.profiles.full_name || rating.profiles.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(rating.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">
                        {((rating.taste + rating.hygiene + rating.quantity + rating.value_for_money) / 4).toFixed(1)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2 text-sm mb-2">
                    <div>
                      <span className="text-gray-500">Taste:</span>
                      <span className="ml-1">{rating.taste}/5</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Hygiene:</span>
                      <span className="ml-1">{rating.hygiene}/5</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <span className="ml-1">{rating.quantity}/5</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Value:</span>
                      <span className="ml-1">{rating.value_for_money}/5</span>
                    </div>
                  </div>
                  
                  {rating.comment && (
                    <div className="flex items-start justify-between">
                      <p className="text-gray-700">{rating.comment}</p>
                      <ReportButton ratingId={rating.id} isReported={rating.reported} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
