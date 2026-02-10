import { axiosInstance } from './axiosInstance'
import { MagasinTypes } from '@/app/magasins/types'

export async function getMagasins(): Promise<MagasinTypes[]> {
  try {
    const { data } = await axiosInstance.get('/api/store')
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
export async function getMagasinById(id: number): Promise<MagasinTypes> {
  try {
    const { data } = await axiosInstance.get(`/api/store/${id}`)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
export async function createMagasin(
  payload: MagasinTypes,
): Promise<MagasinTypes> {
  try {
    const { id, ...rest } = payload
    const { data } = await axiosInstance.post('/api/store', rest)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function updateMagasin(
  payload: MagasinTypes,
): Promise<MagasinTypes> {
  try {
    const { id, ...rest } = payload
    const { data } = await axiosInstance.put(`/api/store/${id}`, rest)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function deleteMagasin(id: number): Promise<any> {
  try {
    const { data } = await axiosInstance.delete(`/api/store/${id}`)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
