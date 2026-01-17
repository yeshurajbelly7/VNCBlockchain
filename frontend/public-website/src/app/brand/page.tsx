'use client'

export default function BrandPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Brand Kit</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
            Download our official logos, colors, and brand assets
          </p>
          <div className="card-gradient rounded-xl p-12">
            <div className="w-32 h-32 bg-gradient-quantum rounded-2xl mx-auto mb-8"></div>
            <button className="btn-primary">Download Brand Assets</button>
          </div>
        </div>
      </div>
    </main>
  )
}
