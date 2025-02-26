import { ChevronLeft } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Finalize: React.FC = () => {
	const navigate = useNavigate()

	return (
		<div className='finalize'>
			<div className='finalize__header'>
				<h1 className='finalize__title'>Finalize</h1>
				<span className='finalize__text'>Spring promotion</span>
			</div>
			<button onClick={() => navigate('/')} className='back-button'>
				<ChevronLeft />
				Back
			</button>
		</div>
	)
}

export default Finalize
