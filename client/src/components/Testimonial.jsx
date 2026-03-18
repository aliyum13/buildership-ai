import { assets } from "../assets/assets"

const Testimonial = () => {
    const testimonialData = [
        {
            image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
            name: 'Sarah Chen',
            title: 'Founder, TechStart Inc',
            content: 'BuilderShip AI helped me validate my business idea and create a compelling pitch deck in days, not weeks. The AI tools are game-changers for early-stage founders.',
            rating: 5,
        },
        {
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
            name: 'Michael Rodriguez',
            title: 'CEO, GrowthLabs',
            content: 'The business planning tools and content generation features have transformed our startup workflow. We can focus on building while AI handles the documentation.',
            rating: 5,
        },
        {
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
            name: 'Emily Watson',
            title: 'Entrepreneur & Consultant',
            content: 'I use BuilderShip for all my client projects. From market research to visual content - everything I need for entrepreneurship consulting in one platform.',
            rating: 5,
        },
    ]

    return (
        <div className='px-4 sm:px-20 xl:px-32 py-24' id="testimonials">
            <div className='text-center'>
                <h2 className='text-slate-700 text-[42px] font-semibold'>Trusted by Entrepreneurs</h2>
                <p className='text-gray-500 max-w-lg mx-auto'>
                    Join thousands of founders and business owners who are building their dreams with BuilderShip AI.
                </p>
            </div>
            <div className='flex flex-wrap mt-10 justify-center'>
                {testimonialData.map((testimonial, index) => (
                    <div key={index} className='p-8 m-4 max-w-xs rounded-lg bg-[#FDFDFE] shadow-lg border border-gray-100 hover:-translate-y-1 transition duration-300 cursor-pointer'>
                        <div className="flex items-center gap-1">
                            {Array(5).fill(0).map((_, idx) => (
                                <img 
                                    key={idx} 
                                    src={idx < testimonial.rating ? assets.star_icon : assets.star_dull_icon} 
                                    className='w-4 h-4' 
                                    alt="star"
                                />
                            ))}
                        </div>
                        <p className='text-gray-600 text-sm my-5 leading-relaxed'>"{testimonial.content}"</p>
                        <hr className='mb-5 border-gray-300' />
                        <div className='flex items-center gap-4'>
                            <img 
                                src={testimonial.image} 
                                className='w-12 h-12 object-cover rounded-full' 
                                alt={testimonial.name} 
                            />
                            <div className='text-sm text-gray-600'>
                                <h3 className='font-semibold text-gray-800'>{testimonial.name}</h3>
                                <p className='text-xs text-gray-500'>{testimonial.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Testimonial