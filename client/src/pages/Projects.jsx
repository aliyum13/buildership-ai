import React, { useEffect, useState } from 'react'
import { Plus, FolderOpen, ChevronRight } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    project_name: '',
    description: '',
    industry: 'Technology',
    stage: 'ideation'
  })

  const { getToken } = useAuth()
  const navigate = useNavigate()

  const industries = ['Technology', 'E-commerce', 'Healthcare', 'Education', 'Finance', 'Real Estate', 'Food & Beverage', 'Other']
  const stages = [
    { value: 'ideation', label: 'Ideation', color: '#2C459D' },
    { value: 'planning', label: 'Planning', color: '#3D56B2' },
    { value: 'development', label: 'Development', color: '#4A63B3' },
    { value: 'launch', label: 'Launch', color: '#5B72BD' },
    { value: 'growth', label: 'Growth', color: '#6A80CA' }
  ]

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('/api/projects/list', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setProjects(data.projects)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/projects/create', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        toast.success('Project created!')
        setShowModal(false)
        setFormData({ project_name: '', description: '', industry: 'Technology', stage: 'ideation' })
        fetchProjects()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <div className='h-full overflow-y-scroll p-6'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-semibold text-slate-700'>My Projects</h1>
          <p className='text-sm text-gray-500 mt-1'>Manage your business ventures</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className='flex items-center gap-2 bg-[#2C459D] text-white px-4 py-2 rounded-lg hover:bg-[#3D56B2] transition-colors'
        >
          <Plus className='w-4 h-4' /> New Project
        </button>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-10 w-10 border-3 border-[#2C459D] border-t-transparent'></div>
        </div>
      ) : projects.length === 0 ? (
        <div className='flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-gray-200'>
          <FolderOpen className='w-16 h-16 text-gray-300 mb-4' />
          <p className='text-gray-500 mb-4'>No projects yet</p>
          <button
            onClick={() => setShowModal(true)}
            className='bg-[#2C459D] text-white px-6 py-2 rounded-lg hover:bg-[#3D56B2] transition-colors'
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {projects.map((project) => {
            const stageInfo = stages.find(s => s.value === project.stage)
            return (
              <div
                key={project.id}
                onClick={() => navigate(`/ai/projects/${project.id}`)}
                className='bg-white p-5 rounded-lg border border-gray-200 hover:shadow-lg transition-all cursor-pointer'
              >
                <div className='flex justify-between items-start mb-3'>
                  <h3 className='font-semibold text-lg text-slate-700'>{project.project_name}</h3>
                  <ChevronRight className='w-5 h-5 text-gray-400' />
                </div>
                <p className='text-sm text-gray-600 mb-3 line-clamp-2'>{project.description}</p>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full'>{project.industry}</span>
                  <span
                    className='text-xs px-2 py-1 rounded-full text-white'
                    style={{ backgroundColor: stageInfo?.color }}
                  >
                    {stageInfo?.label}
                  </span>
                </div>
                <p className='text-xs text-gray-400 mt-3'>
                  Created {new Date(project.created_at).toLocaleDateString()}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h2 className='text-xl font-semibold mb-4'>Create New Project</h2>
            <form onSubmit={handleSubmit}>
              <label className='block mb-3'>
                <span className='text-sm font-medium text-gray-700'>Project Name</span>
                <input
                  type='text'
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  className='w-full p-2 mt-1 border border-gray-300 rounded-lg outline-none focus:ring-2 ring-[#2C459D]'
                  required
                />
              </label>
              <label className='block mb-3'>
                <span className='text-sm font-medium text-gray-700'>Description</span>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className='w-full p-2 mt-1 border border-gray-300 rounded-lg outline-none focus:ring-2 ring-[#2C459D]'
                  rows={3}
                />
              </label>
              <label className='block mb-3'>
                <span className='text-sm font-medium text-gray-700'>Industry</span>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className='w-full p-2 mt-1 border border-gray-300 rounded-lg outline-none focus:ring-2 ring-[#2C459D]'
                >
                  {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
              </label>
              <label className='block mb-4'>
                <span className='text-sm font-medium text-gray-700'>Stage</span>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className='w-full p-2 mt-1 border border-gray-300 rounded-lg outline-none focus:ring-2 ring-[#2C459D]'
                >
                  {stages.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </label>
              <div className='flex gap-3'>
                <button
                  type='button'
                  onClick={() => setShowModal(false)}
                  className='flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2 bg-[#2C459D] text-white rounded-lg hover:bg-[#3D56B2] transition-colors'
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects