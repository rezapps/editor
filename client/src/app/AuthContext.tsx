'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
	email: string
	role: string
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    const storedUser = sessionStorage.getItem('user')
    if (token && storedUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (token: string, user: User) => {
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('user', JSON.stringify(user))
    setIsAuthenticated(true)
    setUser(user)
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setIsAuthenticated(false)
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
