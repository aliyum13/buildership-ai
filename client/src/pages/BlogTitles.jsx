import { useAuth } from '@clerk/clerk-react'
import { Hash, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const titleTypes = [
    'Blog Post', 'Product Launch', 'Social Media Campaign',
    'Email Newsletter', 'Landing Page', 'Press Release', 'Case Study', 'Webinar/Event'
  ]

  const [selectedType, setSelectedType] = useState('Blog Post')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const {getToken} = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const prompt = `Generate 5-7 compelling, attention-grabbing titles for a ${selectedType} about: "${input}".
      
      Make them:
      - Engaging and clickable
      - Suitable for entrepreneurs and business audiences
      - Action-oriented when appropriate
      - SEO-friendly
      
      Format: Provide a numbered list with brief explanations of why each title works.`

      const { data } = await axios.post('/api/ai/generate-blog-title', {prompt}, {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })
      if (data.success) {
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
            <h1 className='text-xl font-semibold'>Marketing Title Generator</h1>
          </div>
          <p className='mt-6 text-sm font-medium'>Topic or Main Message</p>
          <input
            onChange={(e)=>setInput(e.target.value)}
            value={input}
            type="text"
            className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
            placeholder='E.g., Launching our new productivity app for remote teams'
            required
          />
          <p className='mt-4 text-sm font-medium'>Content Type</p>
          <div className='mt-3 flex gap-3 flex-wrap'>
            {titleTypes.map((item)=>(
              <span
                onClick={()=> setSelectedType(item)}
                className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-colors ${selectedType === item ? 'bg-[#2C459D] text-white border-[#2C459D]' : 'text-gray-500 border-gray-300 hover:border-[#2C459D]'}`}
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
          <div className='mt-4 p-3 bg-purple-50 border border-purple-100 rounded-lg'>
            <p className='text-xs text-purple-800'>
              <strong>💡 Pro Tip:</strong> Include your target audience, key benefit, or unique selling point for more tailored title suggestions.
            </p>
          </div>
          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#2C459D] to-[#4A63B3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:shadow-lg transition-all'>
            {loading ? (
              <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            ) : (
              <Hash className='w-5'/>
            )}
            Generate Titles
          </button>
      </form>

      {/* Right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200' style={{minHeight: '384px'}}>
          <div className='flex items-center gap-3'>
            <Hash className='w-5 h-5 text-[#2C459D]' />
            <h1 className='text-xl font-semibold'>Title Suggestions</h1>
          </div>
          {!content ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Hash className='w-9 h-9' />
                <p className='text-center'>Enter your topic and select content type to generate compelling titles</p>
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

export default BlogTitles