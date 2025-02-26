import axios from 'axios'
import { Site, Test } from '../types/main'

const api = axios.create({
	baseURL: 'http://localhost:3100',
})

export const getSites = () => api.get<Site[]>('/sites')
export const getSiteById = (id: number) => api.get<Site>(`/sites/${id}`)
export const getTests = () => api.get<Test[]>('/tests')
export const getTestById = (id: number) => api.get<Test>(`/tests/${id}`)
