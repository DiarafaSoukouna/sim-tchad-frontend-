export interface ProduitTypeAttribute {
  id?: number
  name: string
}

export interface TypeProduitTypes {
  id: number
  name: string
  code: string
  attributes?: ProduitTypeAttribute[]
}
