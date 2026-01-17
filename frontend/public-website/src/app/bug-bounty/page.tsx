'use client'

export default function BugBountyPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Bug Bounty Program</h1>
          <div className="card-gradient rounded-xl p-8">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Help us keep VNC-20 secure. Report vulnerabilities and earn rewards.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                <div className="text-3xl font-bold text-primary-600 mb-2">Up to $50K</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Critical Issues</div>
              </div>
              <div className="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                <div className="text-3xl font-bold text-primary-600 mb-2">Up to $10K</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">High Severity</div>
              </div>
              <div className="text-center p-6 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                <div className="text-3xl font-bold text-primary-600 mb-2">Up to $2K</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Medium Severity</div>
              </div>
            </div>
            <button className="btn-primary w-full">Submit a Report</button>
          </div>
        </div>
      </div>
    </main>
  )
}
