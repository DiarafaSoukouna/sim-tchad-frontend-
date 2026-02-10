'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Package,
  Tag,
  FileText,
  MapPin,
  Ruler,
  Calendar,
  Hash,
  DollarSign,
  Layers,
  ShoppingBag,
  Store,
  User,
  ImageIcon,
  Pencil,
  Loader2,
} from 'lucide-react'

import type { ProduitType, DetailFieldProps } from '../types'
import { getProduitById } from '@/functions/produits'
import { Navigation } from '@/components/navigation'
import { getTypeProduitById } from '@/functions/typeProduits'
import { getUniteMesureById } from '@/functions/uniteMesures'
import { getZoneProductionById } from '@/functions/zoneProduction'
import { getSpeculationsById } from '@/functions/speculations'
import { getActeurById } from '@/functions/acteurs'
import { getMagasinById } from '@/functions/magasins'
import { MagasinTypes } from '@/app/magasins/types'
import { ActorType } from '@/app/acteurs/types'
import { SpeculationType } from '@/app/parametrage/speculations/types'
import { ZoneProductionTypes } from '@/app/parametrage/zones/types'
import { UniteMesureTypes } from '@/app/parametrage/autres/uniteMesures/types'
import { TypeProduitTypes } from '../typeProduits/types'

function DetailField({ icon, label, value }: DetailFieldProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-foreground break-words">
          {value || (
            <span className="text-muted-foreground italic">Non renseigne</span>
          )}
        </p>
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const [produit, setProduit] = useState<ProduitType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [typeProduit, setTypeProduit] = useState<TypeProduitTypes | null>(null)
  const [uniteMesure, setUniteMesure] = useState<UniteMesureTypes | null>(null)
  const [zoneProduction, setZoneProduction] =
    useState<ZoneProductionTypes | null>(null)
  const [speculation, setSpeculation] = useState<SpeculationType | null>(null)
  const [acteur, setActeur] = useState<ActorType | null>(null)
  const [magasin, setMagasin] = useState<MagasinTypes | null>(null)

  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const photoUrl = produit?.photo
    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${produit.photo}`
    : null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return null
    try {
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(dateStr))
    } catch {
      return dateStr
    }
  }
  const handleTypeProduitFetch = useCallback(async (typeId: number) => {
    try {
      const res = await getTypeProduitById(typeId)
      if (res) {
        setTypeProduit(res)
      }
    } catch (err) {
      console.error('Erreur lors de la recuperation du type de produit:', err)
    }
  }, [])
  const handleUniteMesureFetch = useCallback(async (uniteId: number) => {
    try {
      const res = await getUniteMesureById(uniteId)
      if (res) {
        setUniteMesure(res)
      }
    } catch (err) {
      console.error('Erreur lors de la recuperation de l unite de mesure:', err)
    }
  }, [])
  const handleZoneProductionFetch = useCallback(async (zoneId: number) => {
    try {
      const res = await getZoneProductionById(zoneId)
      if (res) {
        setZoneProduction(res)
      }
    } catch (err) {
      console.error(
        'Erreur lors de la recuperation du type de zone de production:',
        err,
      )
    }
  }, [])
  const handleSpeculationFetch = useCallback(async (speculationId: number) => {
    try {
      const res = await getSpeculationsById(speculationId)
      if (res) {
        setSpeculation(res)
      }
    } catch (err) {
      console.error(
        'Erreur lors de la recuperation du type de speculation:',
        err,
      )
    }
  }, [])
  const handleActeurFetch = useCallback(async (acteurId: number) => {
    try {
      const res = await getActeurById(acteurId)
      if (res) {
        setActeur(res)
      }
    } catch (err) {
      console.error('Erreur lors de la recuperation du type de acteur:', err)
    }
  }, [])
  const handleMagasinFetch = useCallback(async (magasinId: number) => {
    try {
      const res = await getMagasinById(magasinId)
      if (res) {
        setMagasin(res)
      }
    } catch (err) {
      console.error('Erreur lors de la recuperation du type de magasin:', err)
    }
  }, [])

  const handleFetch = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const res = await getProduitById(Number(id))
      if (res) {
        setProduit(res)
      } else {
        setError('Produit introuvable.')
      }
    } catch (err) {
      console.error('Erreur lors de la recuperation du produit:', err)
      setError('Erreur lors du chargement du produit.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    handleFetch()
  }, [handleFetch])

  useEffect(() => {
    if (!produit) return

    if (produit.product_type_id) {
      handleTypeProduitFetch(produit.product_type_id)
    }

    if (produit.unit_of_measure_id) {
      handleUniteMesureFetch(produit.unit_of_measure_id)
    }

    if (produit.production_area_id) {
      handleZoneProductionFetch(produit.production_area_id)
    }

    if (produit.speculation_id) {
      handleSpeculationFetch(produit.speculation_id)
    }

    if (produit.actor_id) {
      handleActeurFetch(produit.actor_id)
    }

    if (produit.store_id) {
      handleMagasinFetch(produit.store_id)
    }
  }, [
    produit,
    handleTypeProduitFetch,
    handleUniteMesureFetch,
    handleZoneProductionFetch,
    handleSpeculationFetch,
    handleActeurFetch,
    handleMagasinFetch,
  ])

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Chargement du produit...
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !produit) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <Package className="h-12 w-12 text-muted-foreground/50" />
          <div>
            <p className="text-lg font-medium text-foreground">
              {error || 'Produit introuvable'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {"Le produit demande n'existe pas ou une erreur est survenue."}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="gap-2 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto space-y-6">
      <Navigation />
      <div className="p-2">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3  mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="h-9 w-9 shrink-0 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground text-balance">
                {produit.name}
              </h1>
              {/* <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  {produit.code}
                </Badge>
                {produit.quantity > 0 ? (
                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-600/90 border-transparent">
                    En stock
                  </Badge>
                ) : (
                  <Badge variant="destructive">Rupture</Badge>
                )}
              </div> */}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Photo + Description */}
          <div className="space-y-6 lg:col-span-1">
            {/* Photo */}
            <Card>
              <CardContent className="p-4">
                {photoUrl ? (
                  <div className="overflow-hidden rounded-lg border">
                    <img
                      src={photoUrl || '/placeholder.svg'}
                      alt={produit.name}
                      className="aspect-square w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-dashed bg-muted/50">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground/50" />
                      <p className="mt-2 text-xs text-muted-foreground">
                        Aucune photo
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Description */}
            {produit.description && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {produit.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Prix et Quantite */}
            <Card className="border-primary/20 bg-primary/[0.02]">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Prix unitaire
                    </p>
                    <p className="mt-1 text-xl font-bold text-foreground">
                      {formatPrice(produit.price)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Quantite
                    </p>
                    <p className="mt-1 text-xl font-bold text-foreground">
                      {produit.quantity}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Informations generales */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Informations generales
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-0 sm:grid-cols-2">
                  <DetailField
                    icon={<Hash className="h-4 w-4" />}
                    label="Code produit"
                    value={<span className="font-mono">{produit.code}</span>}
                  />
                  <DetailField
                    icon={<Tag className="h-4 w-4" />}
                    label="Nom"
                    value={produit.name}
                  />
                  <DetailField
                    icon={<Layers className="h-4 w-4" />}
                    label="Type de produit (ID)"
                    value={
                      typeProduit ? typeProduit.name : produit.product_type_id
                    }
                  />
                  <DetailField
                    icon={<ShoppingBag className="h-4 w-4" />}
                    label="Speculation (ID)"
                    value={
                      speculation ? speculation.name : produit.speculation_id
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Mesures et Caracteristiques */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Ruler className="h-4 w-4 text-muted-foreground" />
                  Mesures et caracteristiques
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-0 sm:grid-cols-2">
                  <DetailField
                    icon={<DollarSign className="h-4 w-4" />}
                    label="Prix unitaire"
                    value={formatPrice(produit.price)}
                  />
                  <DetailField
                    icon={<Package className="h-4 w-4" />}
                    label="Quantite"
                    value={produit.quantity}
                  />
                  <DetailField
                    icon={<Ruler className="h-4 w-4" />}
                    label="Unite de mesure (ID)"
                    value={
                      uniteMesure
                        ? uniteMesure.name
                        : produit.unit_of_measure_id
                    }
                  />
                  <DetailField
                    icon={<Ruler className="h-4 w-4" />}
                    label="Mesure utilisee"
                    value={produit.measure_used}
                  />
                  <DetailField
                    icon={<Package className="h-4 w-4" />}
                    label="Forme"
                    value={produit.shape}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Provenance et Localisation */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Provenance et localisation
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-0 sm:grid-cols-2">
                  <DetailField
                    icon={<MapPin className="h-4 w-4" />}
                    label="Origine"
                    value={produit.origin}
                  />
                  <DetailField
                    icon={<MapPin className="h-4 w-4" />}
                    label="Zone de production (ID)"
                    value={
                      zoneProduction
                        ? zoneProduction.name
                        : produit.production_area_id
                    }
                  />
                  <DetailField
                    icon={<Store className="h-4 w-4" />}
                    label="Magasin (ID)"
                    value={magasin ? magasin.name : produit.store_id}
                  />
                  <DetailField
                    icon={<User className="h-4 w-4" />}
                    label="Acteur (ID)"
                    value={acteur ? acteur.actor : produit.actor_id}
                  />
                  <DetailField
                    icon={<Calendar className="h-4 w-4" />}
                    label="Date de production"
                    value={formatDate(produit.production_date)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Attributs dynamiques */}
            {produit.attributes && produit.attributes.length > 0 && (
              <Card className="border-accent">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      Attributs supplementaires
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {produit.attributes.length} attribut
                      {produit.attributes.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="rounded-lg border bg-muted/30">
                    {produit.attributes.map((attr: any, index: any) => (
                      <div key={attr.attribute_id}>
                        <div className="flex items-center justify-between px-4 py-3">
                          <span className="text-sm font-medium text-muted-foreground">
                            {attr.attribute_name}
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {attr.value}
                          </span>
                        </div>
                        {index < produit.attributes!.length - 1 && (
                          <Separator />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        {/* Header */}
      </div>
    </div>
  )
}
