import { axiosInstance } from './axiosInstance'
import { UniteMesureTypes } from '@/app/parametrage/autres/uniteMesures/types'

export async function getUniteMesures(): Promise<UniteMesureTypes[]> {
  try {
    const { data } = await axiosInstance.get('/api/unite_of_measure')
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function createUniteMesure(
  payload: UniteMesureTypes,
): Promise<UniteMesureTypes> {
  try {
    const { data } = await axiosInstance.post('/api/unite_of_measure', payload)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function updateUniteMesure(
  payload: UniteMesureTypes,
): Promise<UniteMesureTypes> {
  try {
    const { id, ...rest } = payload
    const { data } = await axiosInstance.put(
      `/api/unite_of_measure/${id}`,
      rest,
    )
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function deleteUniteMesure(id: number): Promise<any> {
  try {
    const { data } = await axiosInstance.delete(`/api/unite_of_measure/${id}`)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
