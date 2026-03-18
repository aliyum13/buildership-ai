import { Target, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const CompetitorAnalysis = () => {
  const [formData, setFormData] = useState({ your_business: '', industry: '', competitors: '' })
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const { getToken } = useAuth()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const { data } = await axios.post('/api/ai/competitor-analysis', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) { setContent(data.content); toast.success('Analysis completed!') }
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
    setLoading(false)
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'><Sparkles className='w-6 text-[#2C459D]' /><h1 className='text-xl font-semibold'>Competitor Analysis</h1></div>
        <p className='mt-6 text-sm font-medium'>Your Business</p>
        <textarea name="your_business" onChange={handleChange} value={formData.your_business} rows={2}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='Brief description of your business and what you offer' required />
        <p className='mt-4 text-sm font-medium'>Industry</p>
        <input name="industry" onChange={handleChange} value={formData.industry} type="text"
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='E.g., Project Management SaaS' required />
        <p className='mt-4 text-sm font-medium'>Known Competitors</p>
        <textarea name="competitors" onChange={handleChange} value={formData.competitors} rows={3}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='List competitors separated by commas (e.g., Asana, Monday.com, Trello)' required />
        <div className='mt-4 p-3 bg-orange-50 border border-orange-100 rounded-lg'>
          <p className='text-xs text-orange-800'><strong>🎯 Premium Feature:</strong> Get detailed competitive analysis with positioning strategy and differentiation recommendations.</p>
        </div>
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#2C459D] to-[#4A63B3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:shadow-lg transition-all'>
          {loading ? (<span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>) : (<Target className='w-5' />)}
          Analyze Competitors
        </button>
      </form>
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200' style={{minHeight: '384px'}}>
        <div className='flex items-center gap-3'><Target className='w-5 h-5 text-[#2C459D]' /><h1 className='text-xl font-semibold'>Competitive Insights</h1></div>
        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'><Target className='w-9 h-9' /><p className='text-center'>Enter your business and competitor details to receive strategic analysis</p></div>
          </div>
        ) : (
          <div className='mt-3 text-sm text-slate-600 overflow-y-auto' style={{maxHeight: '70vh'}}>
            <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#475569' }}><Markdown>{content}</Markdown></div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompetitorAnalysis