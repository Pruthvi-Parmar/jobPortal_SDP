import React, { useEffect, useRef } from "react"
import { Briefcase, Search, User, Building, CheckCircle, ArrowRight } from 'lucide-react'

export default function ModernHeroVisual() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width = canvas.width
    let height = canvas.height
    
    // For high-DPI displays
    const scale = window.devicePixelRatio || 1
    canvas.width = width * scale
    canvas.height = height * scale
    ctx.scale(scale, scale)
    
    // Set canvas dimensions to match container
    const resizeCanvas = () => {
      const container = canvas.parentElement
      width = container.clientWidth
      height = container.clientHeight
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      canvas.width = width * scale
      canvas.height = height * scale
      ctx.scale(scale, scale)
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // Create particles
    const particles = []
    const particleCount = 50
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        color: `rgba(${79 + Math.random() * 50}, ${70 + Math.random() * 50}, ${229 + Math.random() * 20}, ${0.2 + Math.random() * 0.3})`,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25
      })
    }
    
    // Create connection lines
    const createConnections = (ctx, particles) => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }
    
    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width * scale, height * scale)
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > height) particle.speedY *= -1
        
        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()
      })
      
      // Draw connections
      createConnections(ctx, particles)
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])
  
  return (
    <div className="relative lg:h-[540px] hidden lg:block">
      {/* Canvas background with particles */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full rounded-3xl"
        style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)' }}
      />
      
      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative grid grid-cols-3 gap-4 p-6 w-full max-w-3xl">
          {/* Main feature card */}
          <div className="col-span-3 bg-white rounded-xl p-6 shadow-lg border border-indigo-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Find Your Dream Job</h3>
                <p className="text-gray-600">Thousands of opportunities waiting for you</p>
              </div>
              
            </div>
          </div>
          
          {/* Feature cards */}
          {[
            { title: "Profile", icon: <User className="h-5 w-5" />, color: "bg-purple-50 text-purple-600" },
            { title: "Search", icon: <Search className="h-5 w-5" />, color: "bg-indigo-50 text-indigo-600" },
            { title: "Apply", icon: <CheckCircle className="h-5 w-5" />, color: "bg-violet-50 text-violet-600" },
            { title: "Companies", icon: <Building className="h-5 w-5" />, color: "bg-blue-50 text-blue-600" },
            { title: "Matches", icon: <Briefcase className="h-5 w-5" />, color: "bg-indigo-50 text-indigo-600" },
            { title: "Interviews", icon: <User className="h-5 w-5" />, color: "bg-purple-50 text-purple-600" },
          ].map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-4 shadow-md border border-indigo-50 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <div className={`h-10 w-10 flex items-center justify-center rounded-full ${item.color}`}>
                  {item.icon}
                </div>
                <h4 className="font-medium text-gray-900">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Stats overlay */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-between">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-indigo-50">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-700">10+ Active Jobs</span>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-indigo-50">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-indigo-500"></div>
            <span className="text-sm font-medium text-gray-700">250+ Companies</span>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-indigo-50">
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-purple-500"></div>
            <span className="text-sm font-medium text-gray-700">High Success Rate</span>
          </div>
        </div>
      </div>
      
      {/* Keep the decorative gradient element */}
      <div className="absolute -right-6 -bottom-6 h-64 w-64 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl opacity-20 blur-2xl"></div>
    </div>
  )
}
