'use client'

import Link from 'next/link'
import { Shield, Award, Users } from 'lucide-react'

export default function ValidatorsPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-gradient-to-br from-primary-600 to-quantum-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="w-20 h-20 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Become a Validator</h1>
            <p className="text-xl text-primary-100 mb-8">
              Secure the network and earn rewards. Join 127 active validators today.
            </p>
            <Link href="/staking" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 inline-flex items-center justify-center">
              <Shield className="w-5 h-5 mr-2" />
              Apply to Become Validator
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="card-gradient rounded-xl p-8 text-center">
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">127</div>
              <div className="text-gray-600 dark:text-gray-400">Active Validators</div>
            </div>
            <div className="card-gradient rounded-xl p-8 text-center">
              <Award className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">12-18%</div>
              <div className="text-gray-600 dark:text-gray-400">Annual Rewards</div>
            </div>
            <div className="card-gradient rounded-xl p-8 text-center">
              <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">10,000</div>
              <div className="text-gray-600 dark:text-gray-400">Minimum VNC Stake</div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Requirements</h2>
            <div className="card-gradient rounded-xl p-8 space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-primary-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Minimum Stake</h3>
                  <p className="text-gray-600 dark:text-gray-400">Lock 10,000 VNC tokens as collateral</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-primary-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Infrastructure</h3>
                  <p className="text-gray-600 dark:text-gray-400">Run a dedicated server with 99.9% uptime</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-primary-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">Technical Knowledge</h3>
                  <p className="text-gray-600 dark:text-gray-400">Understand blockchain operations and security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
