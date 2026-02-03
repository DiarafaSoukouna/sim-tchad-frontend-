import { axiosInstance } from './axiosInstance'
import { DeviseTypes } from '@/app/parametrage/autres/devises/types'

export async function getDevises(): Promise<DeviseTypes[]> {
  try {
    const { data } = await axiosInstance.get('/api/currency')
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function createDevise(payload: DeviseTypes): Promise<DeviseTypes> {
  try {
    const { data } = await axiosInstance.post('/api/currency', payload)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function updateDevise(payload: DeviseTypes): Promise<DeviseTypes> {
  try {
    const { id, ...rest } = payload
    const { data } = await axiosInstance.put(`/api/currency/${id}`, rest)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function deleteDevise(id: number): Promise<any> {
  try {
    const { data } = await axiosInstance.delete(`/api/currency/${id}`)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
