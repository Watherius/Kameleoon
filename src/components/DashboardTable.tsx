import classNames from 'classnames'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Status, Test } from '../types/main'
import TableLoadingError from './TableLoadingError'

interface Props {
	tests: Test[]
	sites: Record<number, string>
	loading: boolean
	error: string | null
	onReload: () => void
}

const siteColors: Record<number, string> = {
	1: '#E14165', // market.company.com
	2: '#C2C2FF', // delivery.company.com
	3: '#8686FF', // games.company.com
}
const getColor = (siteId: number) => siteColors[siteId] || '#ccc'

const DashboardTable: React.FC<Props> = ({ tests, sites, loading, error, onReload }) => {
	const navigate = useNavigate()
	const [searchTerm, setSearchTerm] = useState('')
	const inputRef = useRef<HTMLInputElement | null>(null)
	const [sortConfig, setSortConfig] = useState<{
		key: keyof Test | null
		direction: 'asc' | 'desc'
	}>({ key: null, direction: 'asc' })

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (document.activeElement === inputRef.current) return

			if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
				event.preventDefault()
				setSearchTerm(prev => prev + event.key)
				inputRef.current?.focus()
			}
			if (event.key === 'Backspace') {
				event.preventDefault()
				setSearchTerm(prev => prev.slice(0, -1))
				inputRef.current?.focus()
			}
		}

		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [])

	const statusOrder = {
		[Status.ONLINE]: 1,
		[Status.PAUSED]: 2,
		[Status.STOPPED]: 3,
		[Status.DRAFT]: 4,
	}

	const handleSort = (key: keyof Test) => {
		setSortConfig({
			key,
			direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
		})
	}

	const formatUrl = (url: string) => {
		return url.replace(/(^\w+:|^)\/\//, '').replace(/^www\./, '')
	}

	const filteredAndSortedTests = tests
		.filter(test => test.name.toLowerCase().includes(searchTerm.toLowerCase()))
		.sort((a, b) => {
			if (!sortConfig.key) return 0

			if (sortConfig.key === 'status') {
				const diff = statusOrder[a.status] - statusOrder[b.status]
				return sortConfig.direction === 'asc' ? diff : -diff
			}

			const aValue = String(a[sortConfig.key])
			const bValue = String(b[sortConfig.key])
			return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
		})

	return (
		<div className='dashboard'>
			<div className='dashboard__header'>
				<h1 className='dashboard__title'>Dashboard</h1>
				<div className='dashboard__search'>
					<Search className='dashboard__search-icon' />
					<input
						ref={inputRef}
						type='text'
						placeholder='What test are you looking for?'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
					/>
					<span className='dashboard__search-count'>{tests.length} tests</span>
				</div>
			</div>

			{filteredAndSortedTests.length === 0 ? (
				<div className='no-results'>
					{error && <TableLoadingError onReload={onReload} />}
					{!error && loading && <p className='no-results__message loading'>Loading data</p>}
					{!error && !loading && (
						<>
							<p className='no-results__message'>Your search did not match any results.</p>
							<button className='button button--reset' onClick={() => setSearchTerm('')}>
								Reset
							</button>
						</>
					)}
				</div>
			) : (
				<table className='table'>
					<thead>
						<tr>
							<th onClick={() => handleSort('name')}>
								NAME
								{sortConfig.key === 'name' && sortConfig.direction === 'desc' ? (
									<ChevronUp className='table__sort-icon' />
								) : (
									<ChevronDown className='table__sort-icon' />
								)}
							</th>
							<th onClick={() => handleSort('type')}>
								TYPE
								{sortConfig.key === 'type' && sortConfig.direction === 'desc' ? (
									<ChevronUp className='table__sort-icon' />
								) : (
									<ChevronDown className='table__sort-icon' />
								)}
							</th>
							<th onClick={() => handleSort('status')}>
								STATUS
								{sortConfig.key === 'status' && sortConfig.direction === 'desc' ? (
									<ChevronUp className='table__sort-icon' />
								) : (
									<ChevronDown className='table__sort-icon' />
								)}
							</th>
							<th>SITE</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{filteredAndSortedTests.map(test => (
							<tr key={test.id}>
								<td style={{ borderLeft: `4px solid ${getColor(test.siteId)}` }}>{test.name}</td>
								<td>{test.type}</td>
								<td>
									<span
										className={classNames('status-badge', {
											'status-badge--online': test.status === Status.ONLINE,
											'status-badge--paused': test.status === Status.PAUSED,
											'status-badge--stopped': test.status === Status.STOPPED,
											'status-badge--draft': test.status === Status.DRAFT,
										})}
									>
										{test.status}
									</span>
								</td>
								<td>{sites[test.siteId] && formatUrl(sites[test.siteId])}</td>
								<td>
									{test.status === Status.DRAFT ? (
										<button onClick={() => navigate(`/finalize/${test.id}`)} className='button button--secondary'>
											Finalize
										</button>
									) : (
										<button onClick={() => navigate(`/results/${test.id}`)} className='button button--primary'>
											Results
										</button>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	)
}

export default DashboardTable
