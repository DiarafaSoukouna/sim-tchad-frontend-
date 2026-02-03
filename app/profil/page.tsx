'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Settings, Bell, Globe, Save, Check } from 'lucide-react'
import {
  UserProfile,
  AppSettings,
  initialProfile,
  initialSettings,
  initialLangues,
  initialCurrencies,
} from '@/lib/store'

export default function ProfilPage() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile)
  const [settings, setSettings] = useState<AppSettings>(initialSettings)
  const [saved, setSaved] = useState(false)

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value })
    setSaved(false)
  }

  const handleSettingsChange = (
    field: keyof AppSettings,
    value: string | boolean,
  ) => {
    setSettings({ ...settings, [field]: value })
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">
            Profil & Paramètres
          </h1>
        </div>

        <Tabs defaultValue="profil" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="profil" className="gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profil" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-2xl font-semibold text-primary-foreground">
                      {profile.nom
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{profile.nom}</h3>
                    <p className="text-sm text-muted-foreground">
                      {profile.role}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {profile.organisation}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nom">Nom complet</Label>
                    <Input
                      id="nom"
                      value={profile.nom}
                      onChange={(e) =>
                        handleProfileChange('nom', e.target.value)
                      }
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        handleProfileChange('email', e.target.value)
                      }
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Téléphone</Label>
                    <Input
                      id="telephone"
                      type="tel"
                      value={profile.telephone}
                      onChange={(e) =>
                        handleProfileChange('telephone', e.target.value)
                      }
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organisation">Organisation</Label>
                    <Input
                      id="organisation"
                      value={profile.organisation}
                      onChange={(e) =>
                        handleProfileChange('organisation', e.target.value)
                      }
                      className="bg-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Select
                      value={profile.role}
                      onValueChange={(value) =>
                        handleProfileChange('role', value)
                      }
                    >
                      <SelectTrigger className="bg-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administrateur">
                          Administrateur
                        </SelectItem>
                        <SelectItem value="Gestionnaire">
                          Gestionnaire
                        </SelectItem>
                        <SelectItem value="Opérateur">Opérateur</SelectItem>
                        <SelectItem value="Visiteur">Visiteur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Préférences régionales
                  </CardTitle>
                  <CardDescription>
                    Configurez la langue et la devise par défaut
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="langue">Langue de l'interface</Label>
                    <Select
                      value={settings.langue}
                      onValueChange={(value) =>
                        handleSettingsChange('langue', value)
                      }
                    >
                      <SelectTrigger className="bg-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {initialLangues.map((langue) => (
                          <SelectItem key={langue.id} value={langue.code}>
                            {langue.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="devise">Devise par défaut</Label>
                    <Select
                      value={settings.devise}
                      onValueChange={(value) =>
                        handleSettingsChange('devise', value)
                      }
                    >
                      <SelectTrigger className="bg-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {initialCurrencies.map((currency) => (
                          <SelectItem key={currency.id} value={currency.code}>
                            {currency.nom} ({currency.symbole})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notifications
                  </CardTitle>
                  <CardDescription>
                    Gérez vos préférences de notification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">
                        Notifications activées
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Recevoir des alertes sur les mises à jour du système
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications}
                      onCheckedChange={(checked) =>
                        handleSettingsChange('notifications', checked)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Alertes de prix</p>
                      <p className="text-xs text-muted-foreground">
                        Être notifié des variations de prix significatives
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">
                        Rapports hebdomadaires
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Recevoir un résumé hebdomadaire par email
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Enregistré
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Enregistrer les modifications
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}
