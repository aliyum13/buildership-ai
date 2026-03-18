import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Check, Clock, AlertCircle, Trash2 } from 'lucide-react'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import toast from 'react-hot-toast'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getToken } = useAuth()

  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: ''
  })

  const priorities = [
    { value: 'low', label: 'Low', color: '#10B981' },
    { value: 'medium', label: 'Medium', color: '#F59E0B' },
    { value: 'high', label: 'High', color: '#EF4444' }
  ]

  const fetchProjectDetails = async () => {
    try {
      const { data } = await axios.get(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        setProject(data.project)
        setTasks(data.tasks)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/projects/tasks/create', 
        { ...taskForm, project_id: id },
        { headers: { Authorization: `Bearer ${await getToken()}` }}
      )
      if (data.success) {
        toast.success('Task created!')
        setShowTaskModal(false)
        setTaskForm({ title: '', description: '', priority: 'medium', due_date: '' })
        fetchProjectDetails()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'todo' : 'completed'
      const { data } = await axios.put(`/api/projects/tasks/${taskId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${await getToken()}` }}
      )
      if (data.success) {
        fetchProjectDetails()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return
    try {
      const { data } = await axios.delete(`/api/projects/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      if (data.success) {
        toast.success('Task deleted')
        fetchProjectDetails()
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchProjectDetails()
  }, [id])

  if (loading) {
    return (
      <div className='h-full flex items-center justify-center'>
        <div className='animate-spin rounded-full h-10 w-10 border-3 border-[#2C459D] border-t-transparent'></div>
      </div>
    )
  }

  const todoTasks = tasks.filter(t => t.status === 'todo')
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  return (
    <div className='h-full overflow-y-scroll p-6'>
      {/* Header */}
      <button
        onClick={() => navigate('/ai/projects')}
        className='flex items-center gap-2 text-gray-600 hover:text-[#2C459D] mb-4 transition-colors'
      >
        <ArrowLeft className='w-4 h-4' /> Back to Projects
      </button>

      <div className='bg-white p-6 rounded-lg border border-gray-200 mb-6'>
        <h1 className='text-2xl font-semibold text-slate-700 mb-2'>{project?.project_name}</h1>
        <p className='text-gray-600 mb-4'>{project?.description}</p>
        <div className='flex gap-2'>
          <span className='text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full'>{project?.industry}</span>
          <span className='text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full capitalize'>{project?.stage}</span>
          <span className='text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full capitalize'>{project?.status}</span>
        </div>
      </div>

      {/* Tasks Header */}
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold text-slate-700'>Tasks</h2>
        <button
          onClick={() => setShowTaskModal(true)}
          className='flex items-center gap-2 bg-[#2C459D] text-white px-4 py-2 rounded-lg hover:bg-[#3D56B2] transition-colors text-sm'
        >
          <Plus className='w-4 h-4' /> Add Task
        </button>
      </div>

      {/* Task Columns */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* To Do */}
        <div className='bg-white p-4 rounded-lg border border-gray-200'>
          <div className='flex items-center gap-2 mb-4'>
            <Clock className='w-4 h-4 text-gray-600' />
            <h3 className='font-semibold text-gray-700'>To Do ({todoTasks.length})</h3>
          </div>
          <div className='space-y-3'>
            {todoTasks.map(task => (
              <TaskCard key={task.id} task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} priorities={priorities} />
            ))}
          </div>
        </div>

        {/* In Progress */}
        <div className='bg-white p-4 rounded-lg border border-gray-200'>
          <div className='flex items-center gap-2 mb-4'>
            <AlertCircle className='w-4 h-4 text-orange-600' />
            <h3 className='font-semibold text-gray-700'>In Progress ({inProgressTasks.length})</h3>
          </div>
          <div className='space-y-3'>
            {inProgressTasks.map(task => (
              <TaskCard key={task.id} task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} priorities={priorities} />
            ))}
          </div>
        </div>

        {/* Completed */}
        <div className='bg-white p-4 rounded-lg border border-gray-200'>
          <div className='flex items-center gap-2 mb-4'>
            <Check className='w-4 h-4 text-green-600' />
            <h3 className='font-semibold text-gray-700'>Completed ({completedTasks.length})</h3>
          </div>
          <div className='space-y-3'>
            {completedTasks.map(task => (
              <TaskCard key={task.id} task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} priorities={priorities} />
            ))}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md'>
            <h2 className='text-xl font-semibold mb-4'>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <label className='block mb-3'>
                <span className='text-sm font-medium text-gray-700'>Task Title</span>
                <input
                  type='text'
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className='w-full p-2 mt-1 border border-gray-300 rounded-lg outline-none focus:ring-2 ring-[#2C459D]'
                  required
                />
              </label>
              <label className='block mb-3'>
                <span className='text-sm font-medium text-gray-700'>Description</span>
                <textarea
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className='w-full p-2 mt-1 border border-gray-300 rounded-lg outline-none focus:ring-2 ring-[#2C459D]'
                  rows={2}
                />
              </label>
              <label className='block mb-3'>
                <span className='text-sm font-medium text-gray-700'>Priority</span>
                <select
                  value={taskForm.priority}
                  onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  className='w-full p-2 mt-1 border border-gray-300 rounded-lg outline-none focus:ring-2 ring-[#2C459D]'
                >
                  {priorities.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </label>
              <label className='block mb-4'>
                <span className='text-sm font-medium text-gray-700'>Due Date</span>
                <input
                  type='date'
                  value={taskForm.due_date}
                  onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
                  className='w-full p-2 mt-1 border border-gray-300 rounded-lg outline-none focus:ring-2 ring-[#2C459D]'
                />
              </label>
              <div className='flex gap-3'>
                <button
                  type='button'
                  onClick={() => setShowTaskModal(false)}
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

const TaskCard = ({ task, onToggle, onDelete, priorities }) => {
  const priorityInfo = priorities.find(p => p.value === task.priority)
  return (
    <div className='p-3 bg-gray-50 rounded-lg border border-gray-200'>
      <div className='flex items-start justify-between gap-2 mb-2'>
        <div className='flex items-start gap-2 flex-1'>
          <input
            type='checkbox'
            checked={task.status === 'completed'}
            onChange={() => onToggle(task.id, task.status)}
            className='mt-1 w-4 h-4 cursor-pointer'
          />
          <div className='flex-1'>
            <h4 className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {task.title}
            </h4>
            {task.description && (
              <p className='text-xs text-gray-500 mt-1'>{task.description}</p>
            )}
          </div>
        </div>
        <button onClick={() => onDelete(task.id)} className='text-gray-400 hover:text-red-600 transition-colors'>
          <Trash2 className='w-4 h-4' />
        </button>
      </div>
      <div className='flex items-center gap-2'>
        <span className='text-xs px-2 py-0.5 rounded-full' style={{ backgroundColor: priorityInfo.color + '20', color: priorityInfo.color }}>
          {priorityInfo.label}
        </span>
        {task.due_date && (
          <span className='text-xs text-gray-500'>
            Due: {new Date(task.due_date).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  )
}

export default ProjectDetails