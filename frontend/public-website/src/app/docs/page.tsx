'use client'

import { Book, Code, Cpu, Shield, Zap, FileText } from 'lucide-react'
import Link from 'next/link'

export default function DocsPage() {
  const sections = [
    { title: 'Getting Started', icon: Book, href: '/docs/getting-started', desc: 'Quick start guide for developers' },
    { title: 'API Reference', icon: Code, href: '/docs/api', desc: 'Complete API documentation' },
    { title: 'Smart Contracts', icon: FileText, href: '/docs/contracts', desc: 'Deploy and interact with contracts' },
    { title: 'Quantum Security', icon: Shield, href: '/docs/quantum', desc: 'Learn about quantum-resistant features' },
    { title: 'SDK & Tools', icon: Zap, href: '/docs/sdk', desc: 'Libraries and development tools' },
    { title: 'Whitepaper', icon: Cpu, href: '/docs/whitepaper', desc: 'Technical specifications and architecture' }
  ]

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-primary-600 to-quantum-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Book className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Documentation</h1>
            <p className="text-xl text-primary-100">
              Everything you need to build on VNC-20
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <Link key={section.title} href={section.href} className="card-gradient rounded-xl p-6 hover:scale-105 transition-transform">
                <section.icon className="w-12 h-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{section.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{section.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
