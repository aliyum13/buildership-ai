import { DollarSign, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const FinancialProjections = () => {
  const [formData, setFormData] = useState({ business_model: '', revenue_streams: '', pricing: '', target_customers: '', costs: '' })
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const { getToken } = useAuth()

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const { data } = await axios.post('/api/ai/financial-projections', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) { setContent(data.content); toast.success('Projections generated!') }
      else toast.error(data.message)
    } catch (error) { toast.error(error.message) }
    setLoading(false)
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'><Sparkles className='w-6 text-[#2C459D]' /><h1 className='text-xl font-semibold'>Financial Projections</h1></div>
        <p className='mt-6 text-sm font-medium'>Business Model</p>
        <input name="business_model" onChange={handleChange} value={formData.business_model} type="text"
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='E.g., SaaS subscription, Marketplace commission' required />
        <p className='mt-4 text-sm font-medium'>Revenue Streams</p>
        <textarea name="revenue_streams" onChange={handleChange} value={formData.revenue_streams} rows={2}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='How will you make money? List all revenue sources' required />
        <p className='mt-4 text-sm font-medium'>Pricing</p>
        <input name="pricing" onChange={handleChange} value={formData.pricing} type="text"
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='E.g., $29/month basic, $99/month pro' required />
        <p className='mt-4 text-sm font-medium'>Target Customers (Year 1)</p>
        <input name="target_customers" onChange={handleChange} value={formData.target_customers} type="text"
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='E.g., 500 customers by end of Year 1' required />
        <p className='mt-4 text-sm font-medium'>Estimated Costs</p>
        <textarea name="costs" onChange={handleChange} value={formData.costs} rows={2}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='Monthly operational costs, team salaries, marketing spend, etc.' required />
        <div className='mt-4 p-3 bg-teal-50 border border-teal-100 rounded-lg'>
          <p className='text-xs text-teal-800'><strong>💰 Premium Feature:</strong> Get realistic 3-year projections with unit economics, break-even analysis, and funding recommendations.</p>
        </div>
        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#2C459D] to-[#4A63B3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:shadow-lg transition-all'>
          {loading ? (<span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>) : (<DollarSign className='w-5' />)}
          Generate Projections
        </button>
      </form>
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200' style={{minHeight: '384px'}}>
        <div className='flex items-center gap-3'><DollarSign className='w-5 h-5 text-[#2C459D]' /><h1 className='text-xl font-semibold'>Financial Analysis</h1></div>
        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'><DollarSign className='w-9 h-9' /><p className='text-center'>Enter your business financials to receive detailed 3-year projections</p></div>
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

export default FinancialProjections