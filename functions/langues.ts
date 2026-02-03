import { axiosInstance } from './axiosInstance'
import { LangueTypes } from '@/app/parametrage/autres/langues/types'

export async function getLangues(): Promise<LangueTypes[]> {
  try {
    const { data } = await axiosInstance.get('/api/language')
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function createLangue(payload: LangueTypes): Promise<LangueTypes> {
  try {
    const { data } = await axiosInstance.post('/api/language', payload)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function updateLangue(payload: LangueTypes): Promise<LangueTypes> {
  try {
    const { id, ...rest } = payload
    const { data } = await axiosInstance.put(`/api/language/${id}`, rest)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function deleteLangue(id: number): Promise<any> {
  try {
    const { data } = await axiosInstance.delete(`/api/language/${id}`)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
