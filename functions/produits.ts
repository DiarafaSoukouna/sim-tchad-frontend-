import { axiosInstance } from './axiosInstance'
import { NamesProduct, ProduitType } from '@/app/produits/types'

export async function getProduits(): Promise<ProduitType[]> {
  try {
    const { data } = await axiosInstance.get('/api/product')
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function createProduit(formData: FormData): Promise<ProduitType> {
  try {
    const { data } = await axiosInstance.post('/api/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
export async function getProduitById(id: number): Promise<ProduitType> {
  try {
    const { data } = await axiosInstance.get(`/api/products_by_type/${id}`)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
export async function getNamesProduct(id: number): Promise<NamesProduct[]> {
  try {
    const { data } = await axiosInstance.get(`/api/product/namesProducts/${id}`)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
export async function addNameProduct(id: number, payload: any): Promise<any> {
  try {
    const { data } = await axiosInstance.post(
      `/api/product/addLanguagesToProduct/${id}`,
      payload,
    )
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
export async function deleteNameProduct(
  id: number,
  language_id: number,
): Promise<any> {
  try {
    const { data } = await axiosInstance.post(
      `/api/product/deleteLanguageFromProduct/${id}/${language_id}`,
    )
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
export async function updateProduit(
  id: number,
  formData: FormData,
): Promise<ProduitType> {
  try {
    // 🔥 Laravel method spoofing
    formData.append('_method', 'PUT')

    const { data } = await axiosInstance.post(`/api/product/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}

export async function deleteProduit(id: number): Promise<any> {
  try {
    const { data } = await axiosInstance.delete(`/api/product/${id}`)
    return data.data
  } catch (error: any) {
    throw error?.response?.data || error
  }
}
