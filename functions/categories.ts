import { axiosInstance } from './axiosInstance'
import { CategoryType } from '@/app/parametrage/categories/types'

export async function getCategories(): Promise<CategoryType[]> {
  try {
    const { data } = await axiosInstance.get('/api/category')
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function createCategory(
  payload: CategoryType
): Promise<CategoryType> {
  try {
    const { id, ...rest } = payload
    const { data } = await axiosInstance.post('/api/category', rest)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function updateCategory(
  payload: CategoryType
): Promise<CategoryType> {
  try {
    const { id, ...rest } = payload
    const { data } = await axiosInstance.put(`/api/category/${id}`, rest)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function deleteCategory(id: number): Promise<any> {
  try {
    const { data } = await axiosInstance.delete(`/api/category/${id}`)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
