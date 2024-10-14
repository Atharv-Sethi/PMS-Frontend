import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; speedX: number; speedY: number }>>([])

  useEffect(() => {
    const createParticles = () => {
      const newParticles = []
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 5 + 1,
          speedX: Math.random() * 3 - 1.5,
          speedY: Math.random() * 3 - 1.5
        })
      }
      setParticles(newParticles)
    }

    createParticles()
    const interval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(p => ({
          ...p,
          x: (p.x + p.speedX + window.innerWidth) % window.innerWidth,
          y: (p.y + p.speedY + window.innerHeight) % window.innerHeight
        }))
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempted with:', email, password)
    axios.post('http://localhost:8000/api/login', {
        email: email,
        password: password
      })
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
            const token = response.data.access_token;
            localStorage.setItem('access_token', token);
            console.log('Login successful, token stored:', token);
        }else{
            alert("Invalid Credentials")
            console.log("Invalid Credentials")
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const handleSignUp = () => {
    console.log('Sign up clicked')
    // Implement sign up logic or navigation here
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-teal-800 text-white relative overflow-hidden">
      {particles.map((p, index) => (
        <div 
          key={index} 
          className="absolute bg-white opacity-50 rounded-full"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`
          }}
        />
      ))}
      <div className="w-full max-w-md p-8 space-y-8 bg-black bg-opacity-50 backdrop-blur-md rounded-lg shadow-2xl relative z-10">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-16 h-16 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h2 className="mt-6 text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Welcome Back
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 hover:bg-opacity-70 text-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-800 bg-opacity-50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 hover:bg-opacity-70 text-white"
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-md transition duration-300 transform hover:scale-105 text-white font-semibold"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm">Don't have an account?</span>
        </div>
        <button 
          onClick={handleSignUp}
          className="w-full py-2 px-4 bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 rounded-md transition duration-300 transform hover:scale-105 text-white font-semibold"
        >
          Sign Up
        </button>
      </div>
    </div>
  )
}