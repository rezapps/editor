'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../AuthContext'

export default function SignIn() {
	const [userEmail, setUserEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const { login } = useAuth()

	const baseApiUrl: string = process.env.NEXT_PUBLIC_API_URL || ''
	const api = `${baseApiUrl}/auth/login`

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!userEmail || !password) {
			alert('Please enter your email and password')
			return
		}

		setIsLoading(true)
		try {
			const response = await fetch(api, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userEmail, password }),
			})
			if (!response.ok) {
				const errorMessage = await response.text()
				throw new Error(`Sign in failed: ${errorMessage || response.statusText}`)
			}
			const data = await response.json()
			if (!data.token || !data.user) {
				throw new Error("Invalid response format. Missing token or user data.")
			}

			login(data.token, data.user)
			setIsLoading(false)
			router.push(`/dashboard`)

		} catch (error) {
			console.error('An error occurred:', error)
			alert(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
		}
	}

	if (isLoading) {
		return <div className="flex justify-center items-center h-screen">Connecting to server...</div>
	}

	return (
		<div className="w-full max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg overflow-hidden">
			<div className="px-6 py-4">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">Log In</h2>
				<p className="text-gray-600 mb-6">Log In to get started</p>
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
					<button
						type="submit"
						className="w-full bg-gray-700 text-white py-2 px-4 rounded-md"
					>
						Log In
					</button>
				</form>
			</div>
		</div>
	)
}
