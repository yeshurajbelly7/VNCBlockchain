'use client'

import Link from 'next/link'
import { Code2, Terminal, Zap, BookOpen, Github, Rocket } from 'lucide-react'

export default function DevelopersPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-primary-600 to-quantum-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Code2 className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Developer Hub</h1>
            <p className="text-xl text-primary-100 mb-8">
              Build the next generation of decentralized applications on VNC-20
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/docs" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 inline-flex items-center justify-center">
                <Rocket className="w-5 h-5 mr-2" />
                Get Started
              </Link>
              <Link href="/docs" className="btn-secondary border-white text-white hover:bg-white/10 px-8 py-4 inline-flex items-center justify-center">
                <BookOpen className="w-5 h-5 mr-2" />
                View Docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/docs" className="card-gradient rounded-xl p-8 hover:scale-105 transition-transform">
              <Terminal className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Quick Start</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Get up and running in minutes with our SDK</p>
              <code className="block bg-gray-800 text-green-400 p-4 rounded text-sm">
                npm install @vnc20/sdk
              </code>
            </Link>
            <Link href="/docs/contracts" className="card-gradient rounded-xl p-8 hover:scale-105 transition-transform">
              <Code2 className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Smart Contracts</h3>
              <p className="text-gray-600 dark:text-gray-400">Deploy EVM-compatible contracts with quantum security</p>
            </Link>
            <div className="card-gradient rounded-xl p-8">
              <Zap className="w-12 h-12 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">High Performance</h3>
              <p className="text-gray-600 dark:text-gray-400">2000+ TPS with sub-second finality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Developer Resources
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to build on VNC-20
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Link href="/docs" className="card-gradient rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <BookOpen className="w-10 h-10 text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Documentation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Complete guides & tutorials</p>
            </Link>

            <Link href="/docs/api" className="card-gradient rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <Code2 className="w-10 h-10 text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">API Reference</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Full API documentation</p>
            </Link>

            <a href="https://github.com/vnc20" target="_blank" rel="noopener noreferrer" className="card-gradient rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <Github className="w-10 h-10 text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">GitHub</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Browse source code</p>
            </a>

            <Link href="/docs/sdk" className="card-gradient rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <Terminal className="w-10 h-10 text-primary-600 mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">SDK & Tools</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Libraries & CLI tools</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Get Started in Minutes
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Deploy your first smart contract on VNC-20
              </p>
            </div>

            <div className="card-gradient rounded-xl p-8">
              <div className="mb-4">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">1. Install the SDK</span>
              </div>
              <code className="block bg-gray-900 text-green-400 p-4 rounded mb-6 overflow-x-auto">
                npm install @vnc20/sdk
              </code>

              <div className="mb-4">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">2. Initialize Your Project</span>
              </div>
              <code className="block bg-gray-900 text-green-400 p-4 rounded mb-6 overflow-x-auto">
                {`import { VNC20 } from '@vnc20/sdk';

const vnc = new VNC20({
  network: 'testnet',
  apiKey: 'your-api-key'
});`}
              </code>

              <div className="mb-4">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">3. Deploy a Contract</span>
              </div>
              <code className="block bg-gray-900 text-green-400 p-4 rounded overflow-x-auto">
                {`const contract = await vnc.deployContract({
  bytecode: compiledContract.bytecode,
  quantumSecure: true
});

console.log('Contract deployed:', contract.address);`}
              </code>

              <div className="mt-8 text-center">
                <Link href="/docs" className="btn-primary px-8 py-3 inline-flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Read Full Documentation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
