import { axiosInstance } from './axiosInstance'
import axios from 'axios'
import { SecteurType } from '@/app/parametrage/secteurs/types'

export const getSecteurs = async (): Promise<SecteurType[]> => {
  try {
    const response = await axiosInstance.get('/api/sector')
    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          'Erreur lors du chargement des secteurs'
      )
    }

    throw new Error('Erreur inconnue')
  }
}

export const createSecteur = async (
  data: SecteurType
): Promise<SecteurType> => {
  try {
    const { id, ...form } = data
    const response = await axiosInstance.post('/api/sector', form)
    return response.data.Message
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la création du secteur'
      )
    }

    throw new Error('Erreur inconnue')
  }
}
export const updateSecteur = async (
  data: SecteurType
): Promise<SecteurType> => {
  try {
    const { id, ...form } = data
    const response = await axiosInstance.put(`/api/sector/${id}`, form)
    return response.data.Message
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Erreur lors de la création du secteur'
      )
    }

    throw new Error('Erreur inconnue')
  }
}
export const deleteSecteur = async (id: number): Promise<void> => {
  try {
    const res = await axiosInstance.delete(`/api/sector/${id}`)
    return res.data.Message
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          'Erreur lors de la suppression du secteur'
      )
    }

    throw new Error('Erreur inconnue')
  }
}
