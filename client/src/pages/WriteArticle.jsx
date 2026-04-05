import { Edit, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const contentTypes = [
    { value: 'business-plan', label: 'Business Plan Section', length: 800 },
    { value: 'investor-update', label: 'Investor Update', length: 600 },
    { value: 'pitch-narrative', label: 'Pitch Narrative', length: 500 },
    { value: 'blog-post', label: 'Blog Post', length: 1000 },
    { value: 'marketing-copy', label: 'Marketing Copy', length: 400 },
    { value: 'product-description', label: 'Product Description', length: 300 }
  ]

  const [selectedType, setSelectedType] = useState(contentTypes[0])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const {getToken} = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const prompt = `Write a ${selectedType.label} about: ${input}. Make it professional, compelling, and suitable for entrepreneurs and business stakeholders. Target length: approximately ${selectedType.length} words.`
      const {data} = await axios.post('/api/ai/generate-article', {prompt, length: selectedType.length}, {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })
      if(data.success){
        setContent(data.content)
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
      {/* left col */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
          <div className='flex items-center gap-3'>
            <Sparkles className='w-6 text-[#2C459D]'/>
            <h1 className='text-xl font-semibold'>Business Content Generator</h1>
          </div>
          <p className='mt-6 text-sm font-medium'>What do you need to write?</p>
          <input
            onChange={(e)=>setInput(e.target.value)}
            value={input}
            type="text"
            className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
            placeholder='E.g., Our SaaS platform for project management...'
            required
          />
          <p className='mt-4 text-sm font-medium'>Content Type</p>
          <div className='mt-3 flex gap-3 flex-wrap'>
            {contentTypes.map((item, index)=>(
              <span
                onClick={()=> setSelectedType(item)}
                className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-colors ${selectedType.value === item.value ? 'bg-[#2C459D] text-white border-[#2C459D]' : 'text-gray-500 border-gray-300 hover:border-[#2C459D]'}`}
                key={index}
              >
                {item.label}
              </span>
            ))}
          </div>
          <div className='mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg'>
            <p className='text-xs text-blue-800'>
              <strong>💡 Tip:</strong> Be specific about your business context. Include industry, target market, or unique value proposition for best results.
            </p>
          </div>
          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#2C459D] to-[#4A63B3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:shadow-lg transition-all'>
            {loading ? (
              <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
            ) : (
              <Edit className='w-5'/>
            )}
            Generate Content
          </button>
      </form>

      {/* Right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200' style={{minHeight: '384px'}}>
          <div className='flex items-center gap-3'>
            <Edit className='w-5 h-5 text-[#2C459D]' />
            <h1 className='text-xl font-semibold'>Generated Content</h1>
          </div>
          {!content ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Edit className='w-9 h-9' />
                <p className='text-center'>Describe what you need and select content type to get started</p>
              </div>
            </div>
          ) : (
            <div className='mt-3 text-sm text-slate-600'>
              <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#475569' }}>
                <Markdown>{content}</Markdown>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}

export default WriteArticle