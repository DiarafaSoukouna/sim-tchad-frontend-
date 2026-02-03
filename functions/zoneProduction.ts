import { axiosInstance } from './axiosInstance'
import { ZoneProductionTypes } from '@/app/parametrage/zones/types'

export async function getZoneProductions(): Promise<ZoneProductionTypes[]> {
  try {
    const { data } = await axiosInstance.get('/api/production_area')
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function createZoneProduction(
  payload: ZoneProductionTypes
): Promise<ZoneProductionTypes> {
  try {
    const { id, ...rest } = payload
    const { data } = await axiosInstance.post('/api/production_area', rest)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function updateZoneProduction(
  payload: ZoneProductionTypes
): Promise<ZoneProductionTypes> {
  try {
    const { id, ...rest } = payload
    const { data } = await axiosInstance.put(`/api/production_area/${id}`, rest)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function deleteZoneProduction(id: number): Promise<any> {
  try {
    const { data } = await axiosInstance.delete(`/api/production_area/${id}`)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
