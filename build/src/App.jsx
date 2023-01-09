import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Editor from './pages/Editor'
import Register from './pages/Register'

function App() {
  return (
    <>
		<Router basename={process.env.REACT_APP_BASENAME} >
			<div className='container'>
			<Header />
			<Routes>
				<Route path='/' element={<Dashboard />} />
				<Route path='/editor/:id' element={<Editor />} />
				<Route path='/register' element={<Register />} />
			</Routes>
			</div>
      </Router>
    </>
  )
}

export default App
