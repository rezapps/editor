'use client'

import { ToastContainer } from 'react-toastify'
import { Suspense } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import localFont from "next/font/local"
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import "./globals.css"
import { AuthProvider } from "./AuthContext"

const lobster = localFont({
	src: "./fonts/Lobster.ttf",
	variable: "--font-lobster",
	weight: "100 900"
})


export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html>
			<body
				className={`${lobster.variable} antialiased min-h-screen`}
			>
				<AuthProvider>
					<main className="flex flex-col items-center justify-between ui_txt">
						<ToastContainer />
						<Navbar />
						<Suspense fallback={<div>Loading...</div>}>
						{children}
						</Suspense>
					</main>
					<Footer />
				</AuthProvider>
			</body>
		</html>
	)
}
