'use client'

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Support Center</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
            Need help? We're here for you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-gradient rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Documentation</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Find answers in our comprehensive docs</p>
              <button className="btn-primary w-full">Browse Docs</button>
            </div>
            <div className="card-gradient rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Community</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Join our Discord and Telegram</p>
              <button className="btn-secondary w-full">Join Community</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
