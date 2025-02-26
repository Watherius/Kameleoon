import { ChevronLeft } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Results: React.FC = () => {
	const navigate = useNavigate()

	return (
		<div className='results'>
			<div className='results__header'>
				<h1 className='results__title'>Results</h1>
				<span className='results__text'>Order basket redesing</span>
			</div>
			<button onClick={() => navigate('/')} className='back-button'>
				<ChevronLeft />
				Back
			</button>
		</div>
	)
}

export default Results
