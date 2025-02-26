import axios from 'axios'
import { useEffect, useState } from 'react'
import { getSites, getTests } from '../api/config'
import DashboardTable from '../components/DashboardTable'
import { Site, Test } from '../types/main'

function Dashboars() {
	const [tests, setTests] = useState<Test[]>([])
	const [sites, setSites] = useState<Record<number, string>>({})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchData = async () => {
		setLoading(true)
		setError(null)

		try {
			const [testsResponse, sitesResponse] = await Promise.all([getTests(), getSites()])

			setTests(testsResponse.data)
			setSites(
				sitesResponse.data.reduce((acc: Record<number, string>, site: Site) => {
					acc[site.id] = site.url
					return acc
				}, {})
			)
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || 'Failed to fetch data')
			} else {
				setError('An unexpected error occurred')
			}
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	return <DashboardTable tests={tests} sites={sites} loading={loading} error={error} onReload={fetchData} />
}

export default Dashboars
