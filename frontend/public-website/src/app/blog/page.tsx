'use client'

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">VNC Blog</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-gradient rounded-xl overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-primary-400 to-quantum-400"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Latest Update</h3>
                <p className="text-gray-600 dark:text-gray-400">Coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
