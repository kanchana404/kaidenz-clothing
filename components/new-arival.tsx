import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'

const NewArival = () => {
    return (
        <section className="w-full min-h-screen flex flex-col md:flex-row items-center justify-center bg-[#f6f6f6] px-4 sm:px-8">
            {/* Image Section - left on desktop, top on mobile */}
            <div className="w-full md:w-1/2 flex justify-center items-center h-full mb-8 md:mb-0">
                <Image src="/new-arivals.png" alt="New Arrival" width={800} height={800} className="object-contain w-72 h-72 sm:w-[400px] sm:h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px]" priority />
            </div>
            {/* Text Section - right on desktop, bottom on mobile */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left gap-6">
                <p className="text-lg sm:text-xl font-mono text-[#555555]">Get 30% off for new arrivals</p>
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-light leading-tight">
                    New <span className="text-[#ffcb74] font-bold">Arrivals</span>
                </h1>
                <p className="text-base sm:text-lg font-mono text-[#555555] max-w-xl">
                    Discover the latest trends in our newest collection. Designed for style<br className="hidden sm:inline" /> and comfort, our pieces elevate your everyday look. Don&#39;t miss out<br className="hidden sm:inline" />—shop now and enjoy exclusive discounts.
                </p>
                <Button className="bg-[#ffcb74] text-[#111111] px-8 py-3 rounded-none text-base sm:text-lg font-medium shadow-md hover:shadow-xl transition-all duration-300">
                    Shop Now
                </Button>
            </div>
        </section>
    )
}

export default NewArival