'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUp() {
	const [userEmail, setUserEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const [lastName, setLastName] = useState('')
	const router = useRouter()
	const baseApiUrl: string = process.env.NEXT_PUBLIC_API_URL || ''
	const api = `${baseApiUrl}/auth/signup`


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			const response = await fetch(api, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userEmail, password, name, lastName }),
			})
			if (!response.ok) {
				const errorMessage = await response.text() || response.statusText
				throw new Error(`Signup failed: ${errorMessage}`)
			}
			router.push('/signin')
		} catch (error) {
			console.error('An error occurred during sign up:', error)
			alert(`Sign up failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
		}
	}
	

	return (
		<div className="w-full max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign Up</h2>
        <p className="text-gray-600 mb-6">Create your account to get started</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="userEmail"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Enter your first name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              placeholder="Enter your last name"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-700 text-white py-2 px-4 rounded-md"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
	)
}
