import { useState, useEffect } from 'react'
import Product from '../models/Product'


function OurCoffees() {
  const [activeSection, setActiveSection] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(true)

  useEffect(() => {
    // Handle loading state
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 600)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Simple intersection observer for section detection
  useEffect(() => {
    if (isLoading) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute('data-index'))
          setActiveSection(index)
        }
      })
    }, {
      threshold: 0.5
    })

    const sections = document.querySelectorAll('.scroll-section')
    sections.forEach((section, index) => {
      section.setAttribute('data-index', index)
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [isLoading])

  // Preload images - updated image paths
  useEffect(() => {
    const imagePaths = [
      '/images/Kercha.png',
      '/images/The Answer Logo.webp',
      '/images/Night Shift.png',
      '/images/The Answer.png'
    ]

    imagePaths.forEach(path => {
      const img = new Image()
      img.src = path
    })
  }, [])

  return (
    <>
      {/* Loading/Transition overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-white flex items-center justify-center transition-opacity duration-600 ${
          !isLoading ? 'opacity-0 pointer-events-none' : 'opacity-100'
        } ${!isTransitioning ? 'hidden' : ''}`}
      >
        <div className="flex flex-col items-center gap-6">
          {/* Custom animated loader */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#447783] border-r-[#447783] rounded-full animate-[spin_1s_ease-in-out_infinite]"></div>
          </div>
          
          {/* Animated text */}
          <p className="text-[#447783] text-xl font-light tracking-widest animate-pulse">
            LOADING
            <span className="inline-block animate-bounce">.</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className={`${isTransitioning ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 w-full`}>
        <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40">
          {[0, 1, 2, 3].map((dot, index) => (
            <button
              key={index}
              onClick={() => {
                document.querySelectorAll('.scroll-section')[index].scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'center'
                })
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        <div className='w-full bg-white flex flex-col divide-y-8 divide-white'>
          {/* <div className='px-4 scroll-section'>
            <Wholesale/>
          </div> */}
          <div className='px-4 mt-20 scroll-section'>
            <Product 
              layout='left' 
              texturePath='/images/Kercha.png' 
              logoUrl='/images/The Answer Logo.webp'
              loading="eager"
            />
          </div>
          <div className='px-4 mt-20 scroll-section'>
            <Product 
              layout='right' 
              texturePath='/images/Night Shift.png' 
              logoUrl='/images/The Answer Logo.webp'
              loading="eager"
            />
          </div>
          <div className='px-4 mt-20 scroll-section'>
            <Product 
              layout='left' 
              texturePath='/images/The Answer.png' 
              logoUrl='/images/The Answer Logo.webp'
              loading="eager"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default OurCoffees
