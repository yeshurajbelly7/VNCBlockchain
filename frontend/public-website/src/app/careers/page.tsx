'use client'

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Careers at VNC</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
            Join our team and help build the future of blockchain technology
          </p>
          <div className="card-gradient rounded-xl p-12">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We're always looking for talented individuals to join our growing team.
            </p>
            <button className="btn-primary">
              View Open Positions
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
