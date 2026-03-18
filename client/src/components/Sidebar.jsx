import { Protect, useClerk, useUser } from '@clerk/clerk-react'
import { 
  Eraser, FileText, Hash, House, Image, LogOut, Scissors, SquarePen, Users,
  Lightbulb, Presentation, BarChart, Target, DollarSign, FolderKanban
} from 'lucide-react';
import React from 'react'
import { NavLink } from 'react-router-dom';

const navItems = [
    { to: '/ai', label: 'Dashboard', Icon: House, section: 'main' },
    
    // Business Planning
    { to: '/ai/validate-idea', label: 'Validate Idea', Icon: Lightbulb, section: 'Business Planning' },
    { to: '/ai/pitch-deck', label: 'Pitch Deck', Icon: Presentation, section: 'Business Planning' },
    { to: '/ai/market-research', label: 'Market Research', Icon: BarChart, section: 'Business Planning' },
    { to: '/ai/competitor-analysis', label: 'Competitor Analysis', Icon: Target, section: 'Business Planning' },
    { to: '/ai/financial-projections', label: 'Financial Projections', Icon: DollarSign, section: 'Business Planning' },
    
    // Project Management
    { to: '/ai/projects', label: 'My Projects', Icon: FolderKanban, section: 'Project Management' },
    
    // Content & Visual
    { to: '/ai/write-article', label: 'Business Content', Icon: SquarePen, section: 'Content & Visual' },
    { to: '/ai/blog-titles', label: 'Marketing Titles', Icon: Hash, section: 'Content & Visual' },
    { to: '/ai/generate-images', label: 'Product Visuals', Icon: Image, section: 'Content & Visual' },
    { to: '/ai/remove-background', label: 'Pro Backgrounds', Icon: Eraser, section: 'Content & Visual' },
    { to: '/ai/remove-object', label: 'Image Cleanup', Icon: Scissors, section: 'Content & Visual' },
    { to: '/ai/review-resume', label: 'Profile Optimizer', Icon: FileText, section: 'Content & Visual' },
    
    // Community
    { to: '/ai/community', label: 'Community', Icon: Users, section: 'main' },
]

const Sidebar = ({ sidebar, setSidebar }) => {
    const { user } = useUser();
    const { signOut, openUserProfile } = useClerk()

    const renderSection = (sectionName) => {
        const sectionItems = navItems.filter(item => item.section === sectionName)
        return sectionItems.map(({ to, label, Icon }) => (
            <NavLink 
                key={to} 
                to={to} 
                end={to === '/ai'} 
                onClick={() => setSidebar(false)} 
                className={({ isActive }) => `px-3.5 py-2.5 flex items-center gap-3 rounded transition-colors ${isActive ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
            >
                {({ isActive }) => (
                    <>
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                        <span className='text-sm'>{label}</span>
                    </>
                )}
            </NavLink>
        ))
    }

    return (
        <div className={`w-64 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out overflow-y-auto`}>
            <div className='my-7 w-full'>
                <img src={user.imageUrl} alt="User avatar" className='w-13 rounded-full mx-auto' />
                <h1 className='mt-1 text-center font-semibold'>{user.fullName}</h1>
                <p className='text-xs text-center text-gray-500 mt-0.5'>
                    <Protect plan='premium' fallback="Free Plan">Premium Plan</Protect>
                </p>
                
                <div className='px-6 mt-6 text-sm text-gray-600 font-medium'>
                    {/* Main Items */}
                    {renderSection('main').slice(0, 1)}
                    
                    {/* Business Planning Section */}
                    <p className='text-xs font-semibold text-gray-400 uppercase mt-5 mb-2 px-3.5'>Business Planning</p>
                    {renderSection('Business Planning')}
                    
                    {/* Project Management */}
                    <p className='text-xs font-semibold text-gray-400 uppercase mt-5 mb-2 px-3.5'>Projects</p>
                    {renderSection('Project Management')}
                    
                    {/* Content & Visual Section */}
                    <p className='text-xs font-semibold text-gray-400 uppercase mt-5 mb-2 px-3.5'>Content & Visual</p>
                    {renderSection('Content & Visual')}
                    
                    {/* Community */}
                    <p className='text-xs font-semibold text-gray-400 uppercase mt-5 mb-2 px-3.5'>Community</p>
                    {renderSection('main').slice(1)}
                </div>
            </div>

            <div className='w-full border-t border-gray-200 p-4 px-7 flex items-center justify-between'>
                <div onClick={openUserProfile} className='flex gap-2 items-center cursor-pointer'>
                    <img src={user.imageUrl} className='w-8 rounded-full' alt="" />
                    <div>
                        <h1 className='text-sm font-medium'>{user.fullName}</h1>
                        <p className='text-xs text-gray-500'>
                            <Protect plan='premium' fallback="Free">Premium</Protect> User
                        </p>
                    </div>
                </div>
                <LogOut onClick={signOut} className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer' />
            </div>
        </div>
    )
}

export default Sidebar