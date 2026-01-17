'use client'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
          <div className="card-gradient rounded-xl p-8 prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Last updated: January 7, 2026</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3">1. Information We Collect</h2>
            <p className="text-gray-600 dark:text-gray-400">We collect minimal information necessary to provide our services...</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3">2. How We Use Your Information</h2>
            <p className="text-gray-600 dark:text-gray-400">Your information is used to improve our services and ensure security...</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3">3. Data Security</h2>
            <p className="text-gray-600 dark:text-gray-400">We implement industry-standard security measures to protect your data...</p>
          </div>
        </div>
      </div>
    </main>
  )
}
