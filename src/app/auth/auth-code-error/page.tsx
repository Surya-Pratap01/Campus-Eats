import Link from 'next/link'

export default async function AuthCodeErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }> | { error?: string }
}) {
  const resolvedParams = await Promise.resolve(searchParams)
  const error = resolvedParams?.error || 'Unknown error occurred'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">
            There was an error processing your authentication.
          </p>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-left">
            <p className="font-semibold mb-1">Error details:</p>
            <p className="text-sm">{error}</p>
          </div>
          <div className="text-left text-sm text-gray-600 mb-6">
            <p className="font-semibold mb-2">Troubleshooting tips:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check that the link has not expired</li>
              <li>Ensure you are using the latest link sent to your Bennett email</li>
              <li>Try logging in again with your email and password</li>
            </ul>
          </div>
          <Link
            href="/login"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
