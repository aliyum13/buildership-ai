import { FileText, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const ReviewResume = () => {
    const profileTypes = [
        'Founder/CEO Resume', 'Team Member Resume', 'LinkedIn Profile',
        'Investor Bio', 'Speaker Bio', 'Board Member Profile'
    ]
    const [selectedType, setSelectedType] = useState(profileTypes[0])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState('')
    const {getToken} = useAuth()

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            const formData = new FormData()
            formData.append('resume', input)
            formData.append('profileType', selectedType)
            const { data } = await axios.post('/api/ai/resume-review', formData, {
                headers: {Authorization: `Bearer ${await getToken()}`}
            })
            if (data.success) {
                setContent(data.content)
                toast.success('Analysis complete!')
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
            <h1 className='text-xl font-semibold'>Profile Optimizer</h1>
          </div>
          <p className='mt-6 text-sm font-medium'>Upload Resume/Profile (PDF)</p>
          <input
            onChange={(e)=>setInput(e.target.files[0])}
            type="file"
            accept='application/pdf'
            className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
            required
          />
          <p className='text-xs text-gray-500 font-light mt-1'>PDF format only. Max size: 5MB</p>
          <p className='mt-4 text-sm font-medium'>Profile Type</p>
          <div className='mt-3 flex gap-2 flex-wrap'>
            {profileTypes.map((item)=>(
              <span
                onClick={()=> setSelectedType(item)}
                className={`text-xs px-3 py-1 border rounded-full cursor-pointer transition-colors ${selectedType === item ? 'bg-teal-50 text-teal-700 border-teal-300' : 'text-gray-500 border-gray-300 hover:border-teal-300'}`}
                key={item}
              >
                {item}
              </span>
            ))}
          </div>
          <div className='mt-4 p-3 bg-teal-50 border border-teal-100 rounded-lg'>
            <p className='text-xs text-teal-800'>
              <strong>📊 What You&apos;ll Get:</strong> AI analysis covering structure, content quality, keyword optimization, impact statements, and specific improvement recommendations.
            </p>
          </div>
          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#2C459D] to-[#4A63B3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:shadow-lg transition-all'>
            {loading ? (
              <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            ) : (
              <FileText className='w-5'/>
            )}
            Analyze Profile
          </button>
      </form>

      {/* Right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200' style={{minHeight: '384px'}}>
          <div className='flex items-center gap-3'>
            <FileText className='w-5 h-5 text-[#2C459D]' />
            <h1 className='text-xl font-semibold'>AI Analysis & Recommendations</h1>
          </div>
          {!content ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <FileText className='w-9 h-9' />
                <p className='text-center'>Upload your resume or profile to receive detailed feedback and optimization suggestions</p>
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

export default ReviewResume