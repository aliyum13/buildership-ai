import { Eraser, Sparkles } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {

  const useCases = [
    'Team Headshot',
    'Product Photo',
    'Profile Picture',
    'Marketing Image',
    'Presentation Visual',
    'LinkedIn Photo'
  ]

  const [selectedUseCase, setSelectedUseCase] = useState(useCases[0])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const {getToken} = useAuth()
    
  const onSubmitHandler = async (e)=>{
    e.preventDefault();
    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('image', input)

      const { data } = await axios.post('/api/ai/remove-image-background', formData, {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })

      if (data.success) {
        setContent(data.content)
        toast.success('Background removed successfully!')
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
            <h1 className='text-xl font-semibold'>Professional Background Removal</h1>
          </div>
          
          <p className='mt-6 text-sm font-medium'>Upload Your Image</p>
          <input 
            onChange={(e)=>setInput(e.target.files[0])} 
            type="file" 
            accept='image/*' 
            className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600' 
            required
          />
          <p className='text-xs text-gray-500 font-light mt-1'>
            Supports JPG, PNG, and WEBP formats. Max size: 10MB
          </p>

          <p className='mt-4 text-sm font-medium'>Use Case</p>
          <div className='mt-3 flex gap-2 flex-wrap'>
            {useCases.map((item)=>(
              <span 
                onClick={()=> setSelectedUseCase(item)} 
                className={`text-xs px-3 py-1 border rounded-full cursor-pointer transition-colors ${selectedUseCase === item ? 'bg-orange-50 text-orange-700 border-orange-300' : 'text-gray-500 border-gray-300 hover:border-orange-300'}`} 
                key={item}
              >
                {item}
              </span>
            ))}
          </div>

          <div className='mt-4 p-3 bg-orange-50 border border-orange-100 rounded-lg'>
            <p className='text-xs text-orange-800'>
              <strong>💼 Perfect For:</strong> Creating professional headshots, product catalog images, presentation graphics, and social media content.
            </p>
          </div>
          
          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#2C459D] to-[#4A63B3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:shadow-lg transition-all'>
            {loading ? (
              <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            ) : (
              <Eraser className='w-5'/>
            )}
            Remove Background
          </button>
      </form>

      {/* Right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
          <div className='flex items-center gap-3'>
            <Eraser className='w-5 h-5 text-[#2C459D]' />
            <h1 className='text-xl font-semibold'>Professional Result</h1>
          </div>

          {!content ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Eraser className='w-9 h-9' />
                <p className='text-center'>Upload an image to create a professional, transparent background version</p>
              </div>
            </div>
          ) : (
            <div className='mt-3 flex flex-col gap-4'>
              <img src={content} alt="Background removed" className='w-full rounded-lg' style={{backgroundColor: '#f3f4f6'}}/>
              <div className='flex gap-2'>
                <a 
                  href={content} 
                  download 
                  className='flex-1 text-center bg-[#2C459D] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#3D56B2] transition-colors'
                >
                  Download Image
                </a>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}

export default RemoveBackground