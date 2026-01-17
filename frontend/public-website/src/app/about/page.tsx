'use client'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">About VNC-20</h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
              VNC-20 is a next-generation blockchain platform built with quantum-resistant security and high performance in mind.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400">
              To create a secure, scalable, and sustainable blockchain infrastructure that empowers developers and users worldwide.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
