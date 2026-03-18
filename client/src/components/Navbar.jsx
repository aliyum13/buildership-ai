import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import {useClerk, UserButton, useUser} from '@clerk/clerk-react'

const Navbar = () => {
    const navigate = useNavigate()
    const {user} = useUser()
    const { openSignIn } = useClerk()

    // Smooth scroll to section
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <div className='fixed z-50 w-full backdrop-blur-2xl bg-white/80 flex justify-between items-center py-3 px-4 sm:px-20 xl:px-32 border-b border-gray-100'>
            
            {/* Logo with Tagline */}
            <div 
                className='flex items-center gap-3 cursor-pointer group' 
                onClick={() => navigate('/')}
            >
                <img 
                    src={assets.logo} 
                    alt="BuilderShip AI logo" 
                    className='w-32 sm:w-44 transition-transform group-hover:scale-105'
                />
                {/* Optional tagline - shows on larger screens */}
                <div className='hidden lg:block border-l border-gray-300 pl-3'>
                    <p className='text-xs text-gray-600 font-medium'>Tools for Entrepreneurs</p>
                </div>
            </div>

            {/* Navigation Links - Optional for larger screens */}
            <div className='hidden md:flex items-center gap-6 text-sm text-gray-600'>
                <button 
                    onClick={() => scrollToSection('tools')} 
                    className='hover:text-primary transition-colors'
                >
                    Tools
                </button>
                <button 
                    onClick={() => scrollToSection('pricing')} 
                    className='hover:text-primary transition-colors'
                >
                    Pricing
                </button>
                <button 
                    onClick={() => scrollToSection('testimonials')} 
                    className='hover:text-primary transition-colors'
                >
                    Reviews
                </button>
            </div>

            {/* Auth Button */}
            {user ? (
                <UserButton afterSignOutUrl='/' />
            ) : (
                <button 
                    onClick={openSignIn} 
                    className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary hover:bg-[#3D56B2] text-white px-8 sm:px-10 py-2.5 transition-all hover:shadow-lg'
                    style={{ boxShadow: '0 4px 14px rgba(44, 69, 157, 0.25)' }}
                >
                    Get Started 
                    <ArrowRight className='w-4 h-4'/>
                </button>
            )}
        </div>
    )
}

export default Navbar