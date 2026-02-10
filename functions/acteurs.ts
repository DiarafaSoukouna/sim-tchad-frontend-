import { axiosInstance } from './axiosInstance'
import { ActorType } from '@/app/acteurs/types'

export async function getActeurs(): Promise<ActorType[]> {
  try {
    const { data } = await axiosInstance.get('/api/actor')
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function createActeur(formData: FormData): Promise<ActorType> {
  try {
    const { data } = await axiosInstance.post('/api/actor', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
export async function getActeurById(id: number): Promise<ActorType> {
  try {
    const { data } = await axiosInstance.get(`/api/actor/${id}`)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function updateActeur(
  id: number,
  formData: FormData,
): Promise<ActorType> {
  try {
    // 🔥 Laravel method spoofing
    formData.append('_method', 'PUT')

    const { data } = await axiosInstance.post(`/api/actor/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function deleteActeur(id: number): Promise<any> {
  try {
    const { data } = await axiosInstance.delete(`/api/actor/${id}`)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
