export interface ProduitAttribute {
  attribute_id: number
  value: string
  name?: string
}

export interface ProduitType {
  id: number
  name: string
  code: string
  description: string
  product_type_id: number
  speculation_id: number
  unit_of_measure_id: number
  production_area_id: number
  actor_id: number
  store_id: number
  quantity: number
  price: number
  origin: string
  shape: string
  measure_used: string
  production_date: string // ISO date string (YYYY-MM-DD)
  attributes?: ProduitAttribute[]
  photo?: string
}
