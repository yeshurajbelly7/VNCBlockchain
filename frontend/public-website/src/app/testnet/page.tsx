'use client'

export default function TestnetPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-primary-600 to-quantum-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">VNC Testnet</h1>
            <p className="text-xl text-primary-100 mb-8">
              Experiment with VNC-20 without risking real assets
            </p>
            <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-4">
              Get Test Tokens
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
