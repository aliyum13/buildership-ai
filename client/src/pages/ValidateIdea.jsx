import { Lightbulb, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ValidateIdea = () => {
  const industries = ['Technology', 'E-commerce', 'Healthcare', 'Education', 'Finance',
    'Real Estate', 'Food & Beverage', 'Entertainment', 'Marketing', 'Consulting', 'SaaS', 'Other']

  const [formData, setFormData] = useState({ idea: '', industry: 'Technology', target_market: '', problem: '' })
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const { getToken } = useAuth()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const { data } = await axios.post('/api/ai/validate-business-idea', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setContent(data.content)
        toast.success('Idea validated successfully!')
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
          <h1 className='text-xl font-semibold'>Business Idea Validator</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Your Business Idea</p>
        <textarea name="idea" onChange={handleChange} value={formData.idea} rows={3}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='E.g., A mobile app that connects freelance designers with small businesses...' required />
        <p className='mt-4 text-sm font-medium'>Industry</p>
        <select name="industry" onChange={handleChange} value={formData.industry}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'>
          {industries.map((ind) => (<option key={ind} value={ind}>{ind}</option>))}
        </select>
        <p className='mt-4 text-sm font-medium'>Target Market</p>
        <input name="target_market" onChange={handleChange} value={formData.target_market} type="text"
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='E.g., Small businesses with 5-50 employees' required />
        <p className='mt-4 text-sm font-medium'>Problem You&apos;re Solving</p>
        <textarea name="problem" onChange={handleChange} value={formData.problem} rows={2}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder="E.g., Small businesses struggle to find affordable, quality design work..." required />
        <div className='mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg'>
          <p className='text-xs text-blue-800'>
            <strong>💡 Get Honest Feedback:</strong> Our AI will analyze market viability, identify challenges, and provide actionable next steps.
          </p>
        </div>
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#2C459D] to-[#4A63B3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:shadow-lg transition-all'>
          {loading ? (<span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>) : (<Lightbulb className='w-5' />)}
          Validate Idea
        </button>
      </form>

      {/* Right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200' style={{minHeight: '384px'}}>
        <div className='flex items-center gap-3'>
          <Lightbulb className='w-5 h-5 text-[#2C459D]' />
          <h1 className='text-xl font-semibold'>Validation Report</h1>
        </div>
        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Lightbulb className='w-9 h-9' />
              <p className='text-center'>Fill in your business idea details to receive a comprehensive validation analysis</p>
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

export default ValidateIdea