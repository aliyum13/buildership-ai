import { Scissors, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {

  const [input, setInput] = useState('')
  const [object, setObject] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')

  const {getToken} = useAuth()
      
  const onSubmitHandler = async (e)=>{
    e.preventDefault();
    try {
      setLoading(true)

      if(object.split(' ').length > 1){
        toast.error('Please enter only one object name (e.g., "person" not "two people")')
        setLoading(false)
        return
      }

      const formData = new FormData()
      formData.append('image', input)
      formData.append('object', object)

      const { data } = await axios.post('/api/ai/remove-image-object', formData, {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })

      if (data.success) {
        setContent(data.content)
        toast.success('Object removed successfully!')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const commonObjects = ['person', 'chair', 'table', 'sign', 'wire', 'watermark', 'logo', 'sticker']

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* left col */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>

          <div className='flex items-center gap-3'>
            <Sparkles className='w-6 text-[#2C459D]'/>
            <h1 className='text-xl font-semibold'>Smart Object Removal</h1>
          </div>

          <p className='mt-6 text-sm font-medium'>Upload Your Image</p>
          <input 
            onChange={(e)=>setInput(e.target.files[0])} 
            type="file" 
            accept='image/*' 
            className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600' 
            required
          />

          <p className='mt-6 text-sm font-medium'>Object to Remove</p>
          <input 
            onChange={(e)=>setObject(e.target.value)} 
            value={object} 
            className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300' 
            placeholder='e.g., person, watermark, chair' 
            required
          />
          <p className='text-xs text-gray-500 mt-1'>Enter a single object name. Be specific but simple.</p>

          <p className='mt-3 text-xs font-medium text-gray-600'>Common Examples:</p>
          <div className='mt-2 flex gap-2 flex-wrap'>
            {commonObjects.map((item)=>(
              <span 
                onClick={()=> setObject(item)} 
                className='text-xs px-3 py-1 bg-gray-50 border border-gray-200 rounded-full cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors' 
                key={item}
              >
                {item}
              </span>
            ))}
          </div>

          <div className='mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg'>
            <p className='text-xs text-blue-800'>
              <strong>💼 Use Cases:</strong> Remove unwanted people from product photos, clean up presentation screenshots, or eliminate watermarks from stock photos.
            </p>
          </div>
          
          <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#2C459D] to-[#4A63B3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:shadow-lg transition-all'>
            {loading ? (
              <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
            ) : (
              <Scissors className='w-5'/>
            )}
            Remove Object
          </button>
      </form>

      {/* Right col */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
          <div className='flex items-center gap-3'>
            <Scissors className='w-5 h-5 text-[#2C459D]' />
            <h1 className='text-xl font-semibold'>Cleaned Image</h1>
          </div>

          {!content ? (
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Scissors className='w-9 h-9' />
                <p className='text-center'>Upload an image and specify what to remove for a professional, clean result</p>
              </div>
            </div>
          ) : (
            <div className='mt-3 flex flex-col gap-4'>
              <img src={content} alt="Object removed" className='w-full rounded-lg'/>
              <a 
                href={content} 
                download 
                className='text-center bg-[#2C459D] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#3D56B2] transition-colors'
              >
                Download Image
              </a>
            </div>
          )}
      </div>
    </div>
  )
}

export default RemoveObject