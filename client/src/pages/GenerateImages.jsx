import { Image, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {

  const visualTypes = [
    { value: 'product-mockup', label: 'Product Mockup' },
    { value: 'hero-image', label: 'Hero Image' },
    { value: 'social-media', label: 'Social Media Post' },
    { value: 'presentation', label: 'Presentation Graphic' },
    { value: 'infographic', label: 'Infographic Element' },
    { value: 'marketing-banner', label: 'Marketing Banner' }
  ]

  const imageStyles = [
    'Realistic',
    'Modern & Clean',
    'Minimalist',
    'Professional',
    'Tech & Futuristic',
    '3D Render',
    'Illustrated',
    'Abstract'
  ]
    
  const [selectedVisualType, setSelectedVisualType] = useState(visualTypes[0])
  const [selectedStyle, setSelectedStyle] = useState('Modern & Clean')
  const [input, setInput] = useState('')
  const [publish, setPublish] = useState(false)
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const {getToken} = useAuth()
    
  const onSubmitHandler = async (e)=>{
    e.preventDefault();
    try {
      setLoading(true)

      const prompt = `Create a ${selectedVisualType.label} for: ${input}. Style: ${selectedStyle}. Professional, business-appropriate, high-quality visual suitable for entrepreneurship and marketing purposes.`

      const { data } = await axios.post('/api/ai/generate-image', {prompt, publish}, {
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
            <h1 className='text-xl font-semibold'>Product Visual Creator</h1>
          </div>
          
          <p className='mt-6 text-sm font-medium'>Describe Your Visual</p>
          <textarea 
            onChange={(e)=>setInput(e.target.value)} 
            value={input} 
            rows={4} 
            className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' 
            placeholder='E.g., A sleek mobile app dashboard showing analytics, modern interface with blue color scheme...' 
            required
          />

          <p className='mt-4 text-sm font-medium'>Visual Type</p>
          <div className='mt-3 flex gap-2 flex-wrap'>
            {visualTypes.map((item)=>(
              <span 
                onClick={()=> setSelectedVisualType(item)} 
                className={`text-xs px-3 py-1 border rounded-full cursor-pointer transition-colors ${selectedVisualType.value === item.value ? 'bg-[#2C459D] text-white border-[#2C459D]' : 'text-gray-500 border-gray-300 hover:border-[#2C459D]'}`} 
                key={item.value}
              >
                {item.label}
              </span>
            ))}
          </div>

          <p className='mt-4 text-sm font-medium'>Style</p>
          <div className='mt-3 flex gap-2 flex-wrap'>
            {imageStyles.map((item)=>(
              <span 
                onClick={()=> setSelectedStyle(item)} 
                className={`text-xs px-3 py-1 border rounded-full cursor-pointer transition-colors ${selectedStyle === item ? 'bg-green-50 text-green-700 border-green-300' : 'text-gray-500 border-gray-300 hover:border-green-300'}`} 
                key={item}
              >
                {item}
              </span>
            ))}
          </div>

          <div className='my-6 flex items-center gap-2'>
            <label className='relative cursor-pointer'>
              <input 
                type="checkbox" 
                onChange={(e)=>setPublish(e.target.checked)} 
                checked={publish} 
                className='sr-only peer' 
              />
              <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-[#2C459D] transition'></div>
              <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4'></span>
            </label>
            <p className='text-sm'>Share to Community Gallery</p>
          </div>

          <div className='mb-4 p-3 bg-green-50 border border-green-100 rounded-lg'>
            <p className='text-xs text-green-800'>
              <strong>💡 Best Results:</strong> Be specific about colors, composition, and key elements. Mention your brand identity if relevant.
            </p>
          </div>

          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#2C459D] to-[#4A63B3] text-white px-4 py-2 text-sm rounded-lg cursor-pointer hover:shadow-lg transition-all'>
            {loading ? (
              <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            ) : (
              <Image className='w-5'/>
            )}
            Generate Visual
          </button>
      </form>

      {/* Right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
          <div className='flex items-center gap-3'>
            <Image className='w-5 h-5 text-[#2C459D]' />
            <h1 className='text-xl font-semibold'>Generated Visual</h1>
          </div>
          
          {!content ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Image className='w-9 h-9' />
                <p className='text-center'>Describe your visual and select options to generate professional business imagery</p>
              </div>
            </div>
          ) : (
            <div className='mt-3 h-full'>
              <img src={content} alt="Generated business visual" className='w-full h-full rounded-lg'/>
            </div>
          )}
      </div>
    </div>
  )
}

export default GenerateImages