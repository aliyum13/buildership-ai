// PremiumGate.jsx — Drop this in src/components/
// Use this in any page that shows a premium error

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Sparkles } from 'lucide-react'

const PremiumGate = ({ featureName }) => {
  const navigate = useNavigate()

  return (
    <div className='flex-1 flex justify-center items-center p-8'>
      <div className='text-center max-w-sm'>
        <div className='w-16 h-16 bg-gradient-to-br from-[#2C459D] to-[#6A80CA] rounded-2xl flex items-center justify-center mx-auto mb-4'>
          <Lock className='w-8 h-8 text-white' />
        </div>
        <h2 className='text-xl font-semibold text-slate-700 mb-2'>Premium Feature</h2>
        <p className='text-sm text-gray-500 mb-6'>
          <strong>{featureName}</strong> is available on the Premium plan.
          Upgrade to unlock all 10+ AI tools with unlimited usage.
        </p>
        <div className='bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 text-left'>
          <p className='text-xs font-semibold text-blue-800 mb-2'>Premium includes:</p>
          <ul className='text-xs text-blue-700 space-y-1'>
            <li>✅ Pitch Deck Generator</li>
            <li>✅ Market Research Assistant</li>
            <li>✅ Competitor Analysis</li>
            <li>✅ Financial Projections</li>
            <li>✅ AI Image Generation</li>
            <li>✅ Background & Object Removal</li>
            <li>✅ Resume / Profile Optimizer</li>
            <li>✅ Unlimited usage of all tools</li>
          </ul>
        </div>
        <button
          onClick={() => navigate('/#pricing')}
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#2C459D] to-[#4A63B3] text-white px-4 py-3 rounded-lg cursor-pointer hover:shadow-lg transition-all text-sm font-medium'
        >
          <Sparkles className='w-4 h-4' />
          Upgrade to Premium — $29/month
        </button>
        <p className='text-xs text-gray-400 mt-3'>Cancel anytime</p>
      </div>
    </div>
  )
}

export default PremiumGate