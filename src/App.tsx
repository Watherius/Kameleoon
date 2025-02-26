import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Finalize from './pages/Finalize'
import Results from './pages/Results'

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Dashboard />} />
				<Route path='/results/:testId' element={<Results />} />
				<Route path='/finalize/:testId' element={<Finalize />} />
			</Routes>
		</Router>
	)
}

export default App
