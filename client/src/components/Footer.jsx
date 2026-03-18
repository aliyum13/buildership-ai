import React from 'react'
import { assets } from '../assets/assets'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500 mt-20">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
        
        {/* Brand Section */}
        <div className="md:max-w-96">
          <img className="h-9" src={assets.logo} alt="BuilderShip AI logo"/>
          <p className="mt-6 text-sm">
            Empowering entrepreneurs with AI-powered tools. From idea validation to visual design, 
            we provide everything you need to build, launch, and scale your business faster.
          </p>
          
          {/* Social Links */}
          <div className="flex gap-4 mt-6">
            <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-primary transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="hover:text-primary transition-colors" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </a>
            <a href="mailto:support@buildership.ai" className="hover:text-primary transition-colors" aria-label="Email">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Links & Newsletter Section */}
        <div className="flex-1 flex flex-col sm:flex-row items-start md:justify-end gap-10 sm:gap-20">
          
          {/* Quick Links */}
          <div>
            <h2 className="font-semibold mb-5 text-gray-800">Product</h2>
            <ul className="text-sm space-y-2">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/ai" className="hover:text-primary transition-colors">Dashboard</a></li>
              <li><a href="#tools" className="hover:text-primary transition-colors">AI Tools</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
            <ul className="text-sm space-y-2">
              <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:max-w-xs">
            <h2 className="font-semibold text-gray-800 mb-5">Stay Updated</h2>
            <div className="text-sm space-y-2">
              <p>Get the latest AI tools, tips, and entrepreneurship insights delivered weekly.</p>
              <div className="flex items-center gap-2 pt-4">
                <input 
                  className="border border-gray-500/30 placeholder-gray-500 focus:ring-2 ring-primary outline-none w-full h-9 rounded px-2 text-sm" 
                  type="email" 
                  placeholder="Enter your email" 
                />
                <button className="bg-primary hover:bg-primary/90 transition-colors w-24 h-9 text-white rounded cursor-pointer text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="pt-4 pb-5 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-xs md:text-sm text-center sm:text-left">
          Copyright {currentYear} © BuilderShip AI. All Rights Reserved.
        </p>
        <div className="flex gap-4 text-xs md:text-sm">
          <a href="#privacy" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#terms" className="hover:text-primary transition-colors">Terms</a>
          <a href="#cookies" className="hover:text-primary transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer