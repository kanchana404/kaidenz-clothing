"use client"
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import FeaturedProductSection from '@/components/featured-product'
import Footer from '@/components/ui/footer';
import NewArival from '@/components/new-arival'
import PhoneLook from '@/components/phone-look'

const Page = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleButtonMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    target.style.boxShadow = '0 8px 30px rgba(255, 203, 116, 0.25)';
  };

  const handleButtonMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    target.style.boxShadow = '0 4px 20px rgba(255, 203, 116, 0.15)';
  };

  return (
    <div className='w-full min-h-screen flex flex-col' style={{ backgroundColor: '#f6f6f6' }}>

      <div className='flex w-full flex-1 items-center lg:flex-row flex-col'>
        {/* Left: Hero Text */}
        <div className='w-full lg:w-1/2 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 gap-8 lg:gap-12 text-center py-8 lg:py-0 min-h-[80vh] lg:min-h-0'>
          <div className={`transform transition-all duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className='text-7xl sm:text-8xl md:text-7xl lg:text-8xl xl:text-8xl font-light leading-[0.85] tracking-tight mb-4 lg:mb-6'>
              <span className="block font-extralight" style={{ color: '#111111' }}>Discover Your</span>
              <span className="block" style={{ color: '#ffcb74' }}>Style</span>
              <span className="block font-extralight" style={{ color: '#111111' }}>with</span>
              <span className="block font-bold" style={{ color: '#ffcb74' }}>KAIDENZ</span>
            </h1>
          </div>

          <div className={`transform transition-all duration-1000 ease-out delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <p className='text-lg sm:text-xl lg:text-2xl font-light leading-relaxed max-w-lg font-mono px-4 sm:px-0' style={{ color: '#555555' }}>
              Discover the latest fashion trends that define your style. From streetwear to haute couture, express yourself boldly.
            </p>
          </div>

          <div className={`transform transition-all duration-1000 ease-out delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <button
              className="px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-medium rounded-none transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl border-2 border-transparent hover:border-black"
              style={{
                backgroundColor: '#ffcb74',
                color: '#111111',
                boxShadow: '0 4px 20px rgba(255, 203, 116, 0.15)'
              }}
              onMouseEnter={handleButtonMouseEnter}
              onMouseLeave={handleButtonMouseLeave}
            >
              Shop Collection
            </button>
          </div>
        </div>

        {/* Right: Hero Image - Hidden on small screens */}
        <div className='w-1/2 lg:flex justify-center items-center relative hidden'>
          <Image
            src="/bg_empty_hero.png"
            className='-mt-20'
            alt="Hero"
            width={900}
            height={900}
          />
        </div>
      </div>

      <FeaturedProductSection />
      <NewArival />
      <PhoneLook />
      <Footer />
    </div>
  )
}

export default Page