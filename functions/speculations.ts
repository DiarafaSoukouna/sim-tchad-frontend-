import { axiosInstance } from './axiosInstance'
import axios from 'axios'
import { SpeculationType } from '@/app/parametrage/speculations/types'

export const getSpeculations = async (): Promise<SpeculationType[]> => {
  try {
    const response = await axiosInstance.get('/api/speculation')
    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          'Erreur lors du chargement des secteurs',
      )
    }

    throw new Error('Erreur inconnue')
  }
}

export const createSpeculation = async (
  formData: FormData,
): Promise<SpeculationType> => {
  try {
    const response = await axiosInstance.post('/api/speculation', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.Message
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          'Erreur lors de la création du secteur',
      )
    }

    throw new Error('Erreur inconnue')
  }
}

export const updateSpeculation = async (
  id: number,
  formData: FormData,
): Promise<SpeculationType> => {
  try {
    formData.append('_method', 'PUT')
    const response = await axiosInstance.post(
      `/api/speculation/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response.data.Message
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          'Erreur lors de la mise à jour du secteur',
      )
    }

    throw new Error('Erreur inconnue')
  }
}
export const deleteSpeculation = async (id: number): Promise<void> => {
  try {
    const res = await axiosInstance.delete(`/api/speculation/${id}`)
    return res.data.Message
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          'Erreur lors de la suppression du secteur',
      )
    }

    throw new Error('Erreur inconnue')
  }
}
