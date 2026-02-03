import { axiosInstance } from './axiosInstance'
import { TypeActeurTypes } from '@/app/acteurs/typeActeurs/types'

export async function getTypesActeurs(): Promise<TypeActeurTypes[]> {
  try {
    const { data } = await axiosInstance.get('/api/actor_type')
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function createTypeActeur(
  payload: TypeActeurTypes,
): Promise<TypeActeurTypes> {
  try {
    const { id, ...rest } = payload
    const { data } = await axiosInstance.post('/api/actor_type', rest)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function updateTypeActeur(
  payload: TypeActeurTypes,
): Promise<TypeActeurTypes> {
  try {
    const { id, ...rest } = payload
    const { data } = await axiosInstance.put(`/api/actor_type/${id}`, rest)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function deleteTypeActeur(id: number): Promise<any> {
  try {
    const { data } = await axiosInstance.delete(`/api/actor_type/${id}`)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
