import { Presentation, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const PitchDeck = () => {
  const [formData, setFormData] = useState({
    business_name: '', problem: '', solution: '',
    market_size: '', business_model: '', competitive_advantage: ''
  })
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const { getToken } = useAuth()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const { data } = await axios.post('/api/ai/generate-pitch-deck', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setContent(data.content)
        toast.success('Pitch deck generated successfully!')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* Left col */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#2C459D]' />
          <h1 className='text-xl font-semibold'>Pitch Deck Generator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Business Name</p>
        <input name="business_name" onChange={handleChange} value={formData.business_name} type="text"
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='Your startup name' required />
        <p className='mt-4 text-sm font-medium'>Problem Statement</p>
        <textarea name="problem" onChange={handleChange} value={formData.problem} rows={2}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='What problem are you solving?' required />
        <p className='mt-4 text-sm font-medium'>Your Solution</p>
        <textarea name="solution" onChange={handleChange} value={formData.solution} rows={2}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='How does your product/service solve this problem?' required />
        <p className='mt-4 text-sm font-medium'>Market Size</p>
        <input name="market_size" onChange={handleChange} value={formData.market_size} type="text"
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='E.g., $50B global market, growing at 15% annually' required />
        <p className='mt-4 text-sm font-medium'>Business Model</p>
        <textarea name="business_model" onChange={handleChange} value={formData.business_model} rows={2}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='How do you make money?' required />
        <p className='mt-4 text-sm font-medium'>Competitive Advantage</p>
        <textarea name="competitive_advantage" onChange={handleChange} value={formData.competitive_advantage} rows={2}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='What makes you different/better?' required />
        <div className='mt-4 p-3 bg-purple-50 border border-purple-100 rounded-lg'>
          <p className='text-xs text-purple-800'>
            <strong>🚀 Premium Feature:</strong> Generate investor-ready pitch deck content for all 10 essential slides.
          </p>
        </div>
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#2C459D] to-[#4A63B3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:shadow-lg transition-all'>
          {loading ? (<span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>) : (<Presentation className='w-5' />)}
          Generate Pitch Deck
        </button>
      </form>

      {/* Right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200' style={{minHeight: '384px'}}>
        <div className='flex items-center gap-3'>
          <Presentation className='w-5 h-5 text-[#2C459D]' />
          <h1 className='text-xl font-semibold'>Your Pitch Deck</h1>
        </div>
        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Presentation className='w-9 h-9' />
              <p className='text-center'>Fill in your business details to generate a complete investor pitch deck</p>
            </div>
          </div>
        ) : (
          <div className='mt-3 text-sm text-slate-600 overflow-y-auto' style={{maxHeight: '70vh'}}>
            <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#475569' }}>
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PitchDeck