import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Sparkles, Rocket, TrendingUp } from 'lucide-react'

const Hero = () => {
    const navigate = useNavigate()

    const features = [
        { icon: Sparkles, text: 'AI-Powered Tools' },
        { icon: Rocket, text: 'Launch Faster' },
        { icon: TrendingUp, text: 'Scale Smarter' }
    ]

    return (
        <div className='px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen'>
            
            {/* Main Hero Content */}
            <div className='text-center mb-6'>
                <div className='inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm border border-gray-200'>
                    <Sparkles className='w-4 h-4 text-primary' />
                    <span className='text-sm font-medium text-gray-700'>AI Tools for Entrepreneurs</span>
                </div>
                
                <h1 className='text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]'>
                    Build Your Business <br/> 
                    with <span className='text-primary'>AI-Powered</span> Tools
                </h1>
                
                <p className='mt-6 max-w-xs sm:max-w-2xl 2xl:max-w-3xl m-auto max-sm:text-sm text-gray-600 leading-relaxed'>
                    From idea validation to pitch decks, content creation to visual design - everything you need to launch and grow your business, powered by cutting-edge AI technology.
                </p>
            </div>

            {/* Feature Pills */}
            <div className='flex flex-wrap justify-center gap-4 mb-8'>
                {features.map((feature, index) => (
                    <div key={index} className='flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-gray-100'>
                        <feature.icon className='w-4 h-4 text-primary' />
                        <span className='text-sm font-medium text-gray-700'>{feature.text}</span>
                    </div>
                ))}
            </div>

            {/* CTA Buttons */}
            <div className='flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs'>
                <button 
                    onClick={() => navigate('/ai')} 
                    className='bg-primary hover:bg-[#3D56B2] text-white px-10 py-3 rounded-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg flex items-center gap-2'
                    style={{ boxShadow: '0 10px 30px rgba(44, 69, 157, 0.3)' }}
                >
                    <Rocket className='w-4 h-4' />
                    Start Building Now
                </button>
                <button className='bg-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md'>
                    Watch Demo
                </button>
            </div>

            {/* Social Proof */}
            <div className='flex items-center gap-4 mt-10 mx-auto text-gray-600'>
                <img src={assets.user_group} alt="" className='h-8'/>
                <div className='text-left'>
                    <p className='font-semibold text-gray-800'>10,000+ Entrepreneurs</p>
                    <p className='text-sm text-gray-500'>Building their dreams with AI</p>
                </div>
            </div>

            {/* Stats Section */}
            <div className='mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto'>
                {[
                    { number: '50K+', label: 'Business Ideas Validated' },
                    { number: '30K+', label: 'Pitch Decks Created' },
                    { number: '100K+', label: 'Content Pieces Generated' },
                    { number: '25K+', label: 'Visuals Designed' }
                ].map((stat, index) => (
                    <div key={index} className='bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200 text-center hover-lift'>
                        <p className='text-2xl font-bold text-primary'>{stat.number}</p>
                        <p className='text-xs text-gray-600 mt-1'>{stat.label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Hero