'use client'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
          <div className="card-gradient rounded-xl p-8 prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Last updated: January 7, 2026</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-600 dark:text-gray-400">By accessing VNC-20 services, you agree to these terms...</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3">2. Use of Services</h2>
            <p className="text-gray-600 dark:text-gray-400">You must use our services in compliance with all applicable laws...</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3">3. Limitations</h2>
            <p className="text-gray-600 dark:text-gray-400">Services are provided "as is" without warranties of any kind...</p>
          </div>
        </div>
      </div>
    </main>
  )
}
