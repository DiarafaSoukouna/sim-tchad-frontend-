import { axiosInstance } from './axiosInstance'
import { TypeProduitTypes } from '@/app/produits/typeProduits/types'

export async function getTypesProduits(): Promise<TypeProduitTypes[]> {
  try {
    const { data } = await axiosInstance.get('/api/product_type')
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
export async function getTypeProductsAttributes(): Promise<TypeProduitTypes[]> {
  try {
    const { data } = await axiosInstance.get(
      '/api/product_type_with_attributes',
    )
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function createTypeProduit(
  payload: TypeProduitTypes,
): Promise<TypeProduitTypes> {
  try {
    const { id, ...rest } = payload
    const { data } = await axiosInstance.post('/api/product_type', rest)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function updateTypeProduit(
  payload: TypeProduitTypes,
): Promise<TypeProduitTypes> {
  try {
    const { id, ...rest } = payload
    const { data } = await axiosInstance.put(`/api/product_type/${id}`, rest)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function deleteTypeProduit(id: number): Promise<any> {
  try {
    const { data } = await axiosInstance.delete(`/api/product_type/${id}`)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
