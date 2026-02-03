'use client'

import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart3,
  Package,
  Users,
  MapPin,
  Layers,
  TrendingUp,
  Activity,
} from 'lucide-react'

const stats = [
  { label: 'Secteurs', value: '3', icon: Layers, color: 'text-primary' },
  { label: 'Produits', value: '12', icon: Package, color: 'text-chart-2' },
  { label: 'Acteurs', value: '45', icon: Users, color: 'text-chart-3' },
  { label: 'Zones', value: '8', icon: MapPin, color: 'text-chart-4' },
]

const recentActivities = [
  {
    action: 'Nouveau produit ajouté',
    item: 'Maïs grain',
    time: 'Il y a 2 heures',
  },
  { action: 'Acteur modifié', item: 'Jean Dupont', time: 'Il y a 4 heures' },
  { action: 'Zone créée', item: 'Zone Centre', time: 'Il y a 1 jour' },
  { action: 'Catégorie ajoutée', item: 'Tubercules', time: 'Il y a 2 jours' },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">
            Tableau de bord
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Vue d'ensemble du Système d'Information des Marchés
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Aperçu des marchés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center rounded-lg bg-secondary/30 border border-border">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Graphique des tendances
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-primary" />
                Activités récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.item}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
