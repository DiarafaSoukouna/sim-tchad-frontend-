import { FormField } from '@/lib/store'
import { useState, useEffect } from 'react'
import { getTypeProductsAttributes } from '@/functions/typeProduits'
import { TypeProduitTypes } from './typeProduits/types'
import { UniteMesureTypes } from '../parametrage/autres/uniteMesures/types'
import { ZoneProductionTypes } from '../parametrage/zones/types'
import { SpeculationType } from '../parametrage/speculations/types'
import { ActorType } from '../acteurs/types'
import { MagasinTypes } from '../magasins/types'
import { getUniteMesures } from '@/functions/uniteMesures'
import { getZoneProductions } from '@/functions/zoneProduction'
import { getSpeculations } from '@/functions/speculations'
import { getActeurs } from '@/functions/acteurs'
import { getMagasins } from '@/functions/magasins'
import { ProduitAttribute } from './types'

export function useCategoryFormFields(selectedTypeId?: number) {
  const [typesProduitsAttributs, settypesProduitsAttributs] = useState<
    TypeProduitTypes[]
  >([])
  const [dynamicAttributes, setDynamicAttributes] = useState<FormField[]>([])
  const [uniteMeasure, setUniteMeasure] = useState<UniteMesureTypes[]>([])
  const [zones, setZones] = useState<ZoneProductionTypes[]>([])
  const [speculations, setSpeculations] = useState<SpeculationType[]>([])
  const [acteurs, setActeurs] = useState<ActorType[]>([])
  const [magasins, setMagasins] = useState<MagasinTypes[]>([])

  useEffect(() => {
    async function fetchtypesProduitsAttributs() {
      const data = await getTypeProductsAttributes()
      settypesProduitsAttributs(data)
    }
    fetchtypesProduitsAttributs()
  }, [])

  useEffect(() => {
    getUniteMesures().then(setUniteMeasure)
    getZoneProductions().then(setZones)
    getSpeculations().then(setSpeculations)
    getActeurs().then(setActeurs)
    getMagasins().then(setMagasins)
  }, [])

  useEffect(() => {
    if (!selectedTypeId) {
      setDynamicAttributes([])
      return
    }

    const selectedType = typesProduitsAttributs.find(
      (t) => t.id === selectedTypeId,
    )

    if (!selectedType || !selectedType.attributes) {
      setDynamicAttributes([])
      return
    }

    const attrs: FormField[] = selectedType.attributes.map((attr) => ({
      name: attr.name,
      label: attr.name,
      type: 'text',
      required: false,
    }))

    setDynamicAttributes(attrs)
  }, [selectedTypeId, typesProduitsAttributs])

  const formFields: FormField[] = [
    {
      name: 'name',
      label: 'Nom du produit',
      type: 'text',
      required: true,
      fullWidth: true,
    },
    {
      name: 'code',
      label: 'Code',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },
    {
      name: 'product_type_id',
      label: 'Type de produit',
      type: 'select',
      required: true,
      options: typesProduitsAttributs.map((t) => ({
        value: String(t.id),
        label: t.name,
      })),
    },
    {
      name: 'speculation_id',
      label: 'Spéculation',
      type: 'select',
      required: true,
      options: speculations.map((s) => ({
        value: String(s.id),
        label: s.name,
      })),
    },
    {
      name: 'unit_of_measure_id',
      label: 'Unité de mesure',
      type: 'select',
      required: true,
      options: uniteMeasure.map((u) => ({
        value: String(u.id),
        label: u.name,
      })),
    },
    {
      name: 'production_area_id',
      label: 'Zone de production',
      type: 'select',
      required: true,
      options: zones.map((z) => ({
        value: String(z.id),
        label: z.name,
      })),
    },
    {
      name: 'actor_id',
      label: 'Acteur',
      type: 'select',
      required: true,
      options: acteurs.map((a) => ({
        value: String(a.id),
        label: a.actor,
      })),
    },
    {
      name: 'store_id',
      label: 'Magasin',
      type: 'select',
      required: true,
      options: magasins.map((m) => ({
        value: String(m.id),
        label: m.name,
      })),
    },
    {
      name: 'quantity',
      label: 'Quantité',
      type: 'number',
      required: true,
    },
    {
      name: 'price',
      label: 'Prix',
      type: 'number',
      required: true,
    },
    {
      name: 'origin',
      label: 'Origine',
      type: 'text',
    },
    {
      name: 'shape',
      label: 'Forme',
      type: 'text',
    },
    {
      name: 'measure_used',
      label: 'Mesure utilisée',
      type: 'text',
    },
    {
      name: 'production_date',
      label: 'Date de production',
      type: 'date',
      required: true,
    },
    {
      name: 'photo',
      label: 'Photo',
      type: 'file',
      required: false,
    },

    ...dynamicAttributes,
  ]

  return { formFields, typesProduitsAttributs, dynamicAttributes }
}
