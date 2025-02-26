import { CircleX } from 'lucide-react'

const TableLoadingError: React.FC<{ onReload: () => void }> = ({ onReload }) => {
	return (
		<>
			<p className='no-results__error'>
				<CircleX />
				Error loading data
			</p>
			<button className='button button--reset' onClick={() => onReload()}>
				Refresh
			</button>
		</>
	)
}

export default TableLoadingError
