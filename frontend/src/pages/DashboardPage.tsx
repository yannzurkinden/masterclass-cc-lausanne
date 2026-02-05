import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, TrendingUp, Zap } from "lucide-react";
import type { User } from "@/lib/api";

export function DashboardPage({ user }: { user: User }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bonjour, {user.name.split(" ")[0]} !</h1>
        <p className="text-muted-foreground">
          Bienvenue sur LeadPulse, ton CRM personnel.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total contacts
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">dans ton pipeline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En cours
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">prospects actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gagnés
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">deal conclu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assistant IA
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">bientot disponible</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pour commencer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Ce dashboard est ton point de départ. Pendant la masterclass, tu vas
            ajouter des features avec Claude Code :
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Pipeline Kanban drag & drop</li>
            <li>Fiche contact avec historique</li>
            <li>Recherche et filtres avancés</li>
            <li>Assistant IA pour rédiger des emails</li>
            <li>Statistiques et graphiques</li>
          </ul>
          <p>
            Rends-toi sur la page <strong>Contacts</strong> pour voir les données
            de démo déjà en place.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
