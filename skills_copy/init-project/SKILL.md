# Skill: /init-project

Scaffold un projet monorepo complet avec backend FastAPI + frontend React/Vite + DevOps.

## Usage

```
/init-project <nom-du-projet>
```

Crée un dossier `<nom-du-projet>/` dans le répertoire courant avec la structure complète.

---

## Étape 1 — Scaffold Frontend

1. Créer le dossier `{projet}/frontend`
2. Exécuter dans `{projet}/frontend`:
   ```bash
   npm create vite@latest . -- --template react-ts
   npx shadcn@latest init --style default --base-color neutral --css-variables yes
   npx shadcn@latest add dashboard-01
   ```
3. Installer les dépendances:
   ```bash
   npm install @tanstack/react-router @tanstack/router-plugin @tanstack/react-query @tanstack/router-devtools @tanstack/react-query-devtools sonner
   ```
4. Le plugin Tailwind CSS v4 est déjà inclus via `@tailwindcss/vite` (installé par Vite template)

---

## Étape 2 — Personnaliser Frontend

### 2.1 — Polices Gilroy

Copier les polices depuis les assets du skill vers `{projet}/frontend/public/fonts/`:
```
~/.claude/skills/init-project/assets/fonts/Gilroy-Regular.ttf
~/.claude/skills/init-project/assets/fonts/Gilroy-Medium.ttf
~/.claude/skills/init-project/assets/fonts/Gilroy-SemiBold.ttf
~/.claude/skills/init-project/assets/fonts/Gilroy-Bold.ttf
```

### 2.2 — index.css

Remplacer `src/index.css` par le thème oklch + @font-face Gilroy. Utiliser exactement ce pattern:

```css
@import "tailwindcss";

/* Gilroy font family */
@font-face {
  font-family: "Gilroy";
  src: url("/fonts/Gilroy-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Gilroy";
  src: url("/fonts/Gilroy-Medium.ttf") format("truetype");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Gilroy";
  src: url("/fonts/Gilroy-SemiBold.ttf") format("truetype");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Gilroy";
  src: url("/fonts/Gilroy-Bold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* CSS variables for theming (Shadcn compatible) */
@theme {
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.145 0 0);
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.145 0 0);
  --color-popover: oklch(1 0 0);
  --color-popover-foreground: oklch(0.145 0 0);
  --color-primary: oklch(0.205 0 0);
  --color-primary-foreground: oklch(0.985 0 0);
  --color-secondary: oklch(0.97 0 0);
  --color-secondary-foreground: oklch(0.205 0 0);
  --color-muted: oklch(0.97 0 0);
  --color-muted-foreground: oklch(0.556 0 0);
  --color-accent: oklch(0.97 0 0);
  --color-accent-foreground: oklch(0.205 0 0);
  --color-destructive: oklch(0.577 0.245 27.325);
  --color-destructive-foreground: oklch(0.577 0.245 27.325);
  --color-border: oklch(0.922 0 0);
  --color-input: oklch(0.922 0 0);
  --color-ring: oklch(0.708 0 0);
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: oklch(0.145 0 0);
    --color-foreground: oklch(0.985 0 0);
    --color-card: oklch(0.145 0 0);
    --color-card-foreground: oklch(0.985 0 0);
    --color-popover: oklch(0.145 0 0);
    --color-popover-foreground: oklch(0.985 0 0);
    --color-primary: oklch(0.985 0 0);
    --color-primary-foreground: oklch(0.205 0 0);
    --color-secondary: oklch(0.269 0 0);
    --color-secondary-foreground: oklch(0.985 0 0);
    --color-muted: oklch(0.269 0 0);
    --color-muted-foreground: oklch(0.708 0 0);
    --color-accent: oklch(0.269 0 0);
    --color-accent-foreground: oklch(0.985 0 0);
    --color-destructive: oklch(0.396 0.141 25.723);
    --color-destructive-foreground: oklch(0.637 0.237 25.331);
    --color-border: oklch(0.269 0 0);
    --color-input: oklch(0.269 0 0);
    --color-ring: oklch(0.439 0 0);
  }
}

/* Base styles */
body {
  @apply bg-background text-foreground;
  font-family: "Gilroy", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
}

* {
  @apply border-border;
}

/* Respect reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 2.3 — vite.config.ts

```typescript
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import path from "path"

export default defineConfig({
  plugins: [TanStackRouterVite({}), react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
})
```

### 2.4 — main.tsx

```typescript
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"
import "./index.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

const router = createRouter({ routeTree })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
)
```

### 2.5 — lib/api.ts

Créer le fetch wrapper JWT avec auto-refresh. Pattern exact:

```typescript
const API_BASE = "/api"

// Token storage
const TOKEN_KEY = "access_token"
const REFRESH_TOKEN_KEY = "refresh_token"

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

// Custom error class
export class ApiRequestError extends Error {
  status: number
  detail: string

  constructor(status: number, detail: string) {
    super(detail)
    this.name = "ApiRequestError"
    this.status = status
    this.detail = detail
  }
}

interface ValidationError {
  loc?: string[]
  msg?: string
}

interface ErrorBody {
  detail: string | ValidationError[]
}

function formatErrorMessage(errorBody: ErrorBody): string {
  if (Array.isArray(errorBody.detail)) {
    return errorBody.detail
      .map((err) => {
        const field = err.loc?.slice(-1)[0] || "unknown"
        return `${field}: ${err.msg || "Invalid value"}`
      })
      .join(", ")
  }
  return errorBody.detail || "An error occurred"
}

let refreshPromise: Promise<boolean> | null = null

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return false

  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      clearTokens()
      return false
    }

    const data = await response.json()
    setTokens(data.access_token, data.refresh_token)
    return true
  } catch {
    clearTokens()
    return false
  }
}

// Main fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const accessToken = getAccessToken()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (accessToken) {
    (headers as Record<string, string>).Authorization = `Bearer ${accessToken}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  // Handle 401 - try refresh
  if (response.status === 401 && retry) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null
      })
    }

    const refreshed = await refreshPromise
    if (refreshed) {
      return apiFetch<T>(endpoint, options, false)
    }

    window.location.href = "/login"
    throw new ApiRequestError(401, "Session expired")
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({
      detail: "An error occurred",
    }))
    throw new ApiRequestError(response.status, formatErrorMessage(errorBody))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

// HTTP method helpers
export const api = {
  get<T>(endpoint: string): Promise<T> {
    return apiFetch<T>(endpoint, { method: "GET" })
  },
  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return apiFetch<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  },
  put<T>(endpoint: string, data?: unknown): Promise<T> {
    return apiFetch<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  },
  patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return apiFetch<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  },
  delete<T>(endpoint: string): Promise<T> {
    return apiFetch<T>(endpoint, { method: "DELETE" })
  },
}

// Auth API
export const authApi = {
  login(email: string, password: string) {
    return api.post<{
      access_token: string
      refresh_token: string
      token_type: string
      requires_totp: boolean
      totp_pending_token?: string
    }>("/auth/login", { email, password })
  },

  verifyTotp(code: string, totpPendingToken: string) {
    return api.post<{
      access_token: string
      refresh_token: string
      token_type: string
    }>("/auth/verify-totp", { totp_pending_token: totpPendingToken, code })
  },

  getMe() {
    return api.get<import("@/types").User>("/auth/me")
  },

  setupTotp() {
    return api.post<{ secret: string; qr_code_base64: string; provisioning_uri: string }>(
      "/auth/setup-totp"
    )
  },

  enableTotp(code: string) {
    return api.post<{ message: string }>("/auth/enable-totp", { code })
  },

  disableTotp(code: string) {
    return api.post<{ message: string }>("/auth/disable-totp", { code })
  },
}
```

**Note**: Ne PAS inclure les endpoints métier (adminApi, clientApi). Le projet scaffoldé ne contient que `authApi`. Les endpoints métier seront ajoutés au fur et à mesure du développement.

### 2.6 — hooks/useAuth.ts

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { authApi, setTokens, clearTokens, getAccessToken } from "@/lib/api"
import type { User } from "@/types"

export function useAuth() {
  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading,
    error,
  } = useQuery<User>({
    queryKey: ["auth", "me"],
    queryFn: authApi.getMe,
    enabled: !!getAccessToken(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  })

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (data) => {
      if (!data.requires_totp) {
        setTokens(data.access_token!, data.refresh_token!)
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
      }
    },
  })

  const totpMutation = useMutation({
    mutationFn: ({ code, tempToken }: { code: string; tempToken: string }) =>
      authApi.verifyTotp(code, tempToken),
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token)
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] })
    },
  })

  const logout = () => {
    clearTokens()
    queryClient.clear()
    window.location.href = "/login"
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin ?? false,
    error,
    login: loginMutation.mutateAsync,
    loginPending: loginMutation.isPending,
    loginError: loginMutation.error,
    verifyTotp: totpMutation.mutateAsync,
    totpPending: totpMutation.isPending,
    totpError: totpMutation.error,
    logout,
  }
}
```

### 2.7 — types/index.ts

```typescript
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  company_id: string | null
  company_name: string | null
  is_admin: boolean
  is_active: boolean
  totp_enabled: boolean
  created_at: string
  last_login_at: string | null
}
```

### 2.8 — lib/utils.ts

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "CHF"): string {
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("fr-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("fr-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}
```

### 2.9 — Routes

#### routes/__root.tsx

Adapter le layout dashboard-01 de shadcn avec la sidebar. Pattern:

```typescript
import { createRootRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Toaster } from "sonner"
import {
  LayoutDashboard,
  Settings,
  UserCircle,
  LogOut,
  Loader2,
  type LucideIcon,
} from "lucide-react"

interface NavItem {
  to: string
  icon: LucideIcon
  label: string
}

const NAV_LINK_CLASS = "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent [&.active]:bg-accent"

const navItems: NavItem[] = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/settings", icon: Settings, label: "Settings" },
  { to: "/profile", icon: UserCircle, label: "Profile" },
]

function NavLink({ to, icon: Icon, label }: NavItem) {
  return (
    <Link to={to} className={NAV_LINK_CLASS}>
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  )
}

function RootLayout() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isLoginPage = location.pathname === "/login"

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated && !isLoginPage) {
      navigate({ to: "/login" })
    } else if (isAuthenticated && isLoginPage) {
      navigate({ to: "/" })
    }
  }, [isAuthenticated, isLoading, isLoginPage, navigate])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-background">
        <Outlet />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-card">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-bold">{/* Nom du projet */}</h1>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <NavLink key={item.to} {...item} />
          ))}
        </nav>
        <div className="mt-auto border-t p-4">
          <div className="mb-2 text-sm text-muted-foreground">
            {user?.first_name} {user?.last_name}
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      <Toaster richColors position="top-right" />
      <TanStackRouterDevtools />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
```

**Note**: Le titre dans le `<h1>` doit être le nom du projet passé en argument du skill.

#### routes/login.tsx

Page de login avec support TOTP en deux étapes. Pattern:

```typescript
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function LoginPage() {
  const navigate = useNavigate()
  const { login, verifyTotp, loginPending, totpPending, loginError, totpError } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [totpCode, setTotpCode] = useState("")
  const [tempToken, setTempToken] = useState<string | null>(null)
  const [requiresTotp, setRequiresTotp] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await login({ email, password })
      if (result.requires_totp) {
        setRequiresTotp(true)
        setTempToken(result.totp_pending_token!)
      } else {
        navigate({ to: "/" })
      }
    } catch {
      // Error handled by mutation
    }
  }

  const handleTotp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tempToken) return
    try {
      await verifyTotp({ code: totpCode, tempToken })
      navigate({ to: "/" })
    } catch {
      // Error handled by mutation
    }
  }

  if (requiresTotp) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Vérification 2FA</CardTitle>
            <CardDescription>
              Entrez le code de votre application d'authentification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTotp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totp">Code TOTP</Label>
                <Input
                  id="totp"
                  type="text"
                  placeholder="000000"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  maxLength={6}
                  autoFocus
                />
              </div>
              {totpError && (
                <p className="text-sm text-destructive">
                  {(totpError as Error).message || "Code invalide"}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={totpPending}>
                {totpPending ? "Vérification..." : "Vérifier"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setRequiresTotp(false)
                  setTempToken(null)
                  setTotpCode("")
                }}
              >
                Retour
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{/* Nom du projet */}</CardTitle>
          <CardDescription>Connectez-vous pour accéder à l'application</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {loginError && (
              <p className="text-sm text-destructive">
                {(loginError as Error).message || "Identifiants invalides"}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loginPending}>
              {loginPending ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute("/login")({
  component: LoginPage,
})
```

#### routes/index.tsx (Dashboard placeholder)

```typescript
import { createFileRoute } from "@tanstack/react-router"

function DashboardPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p className="text-muted-foreground">Bienvenue sur votre tableau de bord.</p>
    </div>
  )
}

export const Route = createFileRoute("/")({
  component: DashboardPage,
})
```

#### routes/settings.tsx et routes/profile.tsx

Créer des pages placeholder simples avec juste un titre et un texte descriptif, en suivant le même pattern que `index.tsx`.

---

## Étape 3 — Scaffold Backend

### 3.1 — Initialisation

```bash
cd {projet}/backend
uv init --python 3.13
uv add fastapi "uvicorn[standard]" sqlmodel asyncpg alembic "python-jose[cryptography]" "passlib[bcrypt]" pyotp "qrcode[pil]" boto3 pydantic-settings email-validator bcrypt
```

### 3.2 — Structure des fichiers

Créer la structure suivante dans `{projet}/backend/`:

```
app/
├── __init__.py
├── main.py
├── config.py
├── database.py
├── api/
│   ├── __init__.py
│   ├── deps.py
│   └── auth.py
├── models/
│   ├── __init__.py
│   └── user.py
├── schemas/
│   ├── __init__.py
│   ├── auth.py
│   └── user.py
└── services/
    ├── __init__.py
    ├── auth.py
    └── s3.py
```

### 3.3 — app/config.py

Configuration simplifiée (sans bexio, github, rise, smtp, logs, slack):

```python
from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Environment
    environment: str = "development"
    debug: bool = False

    # Database
    database_url: str = "postgresql+asyncpg://app:app_dev@localhost:5432/app_dev"

    # Security
    secret_key: str = "dev-secret-key-change-in-production-min-32-chars"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # S3 Storage
    s3_endpoint_url: str = ""
    s3_access_key_id: str = ""
    s3_secret_access_key: str = ""
    s3_bucket_name: str = "app-storage"

    # Frontend URL (for CORS)
    frontend_url: str = "http://localhost:5173"

    @field_validator("secret_key")
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long")
        return v

    @property
    def is_development(self) -> bool:
        return self.environment == "development"

    @property
    def is_production(self) -> bool:
        return self.environment == "production"

    @property
    def cors_origins(self) -> list[str]:
        origins = [self.frontend_url]
        if self.is_development:
            origins.append("http://localhost:5173")
        return list(set(origins))


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
```

### 3.4 — app/database.py

Identique au portail-client:

```python
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlmodel import SQLModel

from app.config import get_settings

settings = get_settings()

engine = create_async_engine(
    settings.database_url,
    echo=settings.is_development,
    future=True,
)

async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
```

### 3.5 — app/models/user.py

Simplifié (sans relationships métier):

```python
from datetime import datetime
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    hashed_password: str = Field(max_length=255)
    first_name: str = Field(max_length=100)
    last_name: str = Field(max_length=100)

    # TOTP 2FA
    totp_secret: str | None = Field(default=None, max_length=32)
    totp_enabled: bool = Field(default=False)

    # Role
    is_admin: bool = Field(default=False)
    is_active: bool = Field(default=True)

    # Optional company association
    company_id: str | None = Field(default=None, max_length=100)

    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login_at: datetime | None = Field(default=None)

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"
```

**Note**: `company_id` est un simple string ici, pas une FK. Pas de Relationship car pas de table Company dans le scaffold.

### 3.6 — app/schemas/auth.py

Identique au portail-client:

```python
from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class LoginResponse(BaseModel):
    access_token: str | None = None
    refresh_token: str | None = None
    token_type: str = "bearer"
    requires_totp: bool = False
    totp_pending_token: str | None = None


class TOTPVerifyRequest(BaseModel):
    totp_pending_token: str
    code: str = Field(min_length=6, max_length=6)


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TOTPSetupResponse(BaseModel):
    secret: str
    qr_code_base64: str
    provisioning_uri: str


class TOTPEnableRequest(BaseModel):
    code: str = Field(min_length=6, max_length=6)


class MessageResponse(BaseModel):
    message: str
```

### 3.7 — app/schemas/user.py

Simplifié:

```python
from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)


class UserCreate(UserBase):
    password: str = Field(min_length=8)
    company_id: str | None = None
    is_admin: bool = False


class UserUpdate(BaseModel):
    email: EmailStr | None = None
    first_name: str | None = Field(default=None, min_length=1, max_length=100)
    last_name: str | None = Field(default=None, min_length=1, max_length=100)
    is_active: bool | None = None


class UserResponse(UserBase):
    id: UUID
    company_id: str | None
    is_admin: bool
    is_active: bool
    totp_enabled: bool
    created_at: datetime
    last_login_at: datetime | None

    class Config:
        from_attributes = True


class UserMeResponse(UserResponse):
    pass
```

### 3.8 — app/services/auth.py

Identique au portail-client:

```python
import io
from datetime import datetime, timedelta
from typing import Any

import bcrypt
import pyotp
import qrcode
from jose import JWTError, jwt

from app.config import settings


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8"),
    )


def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def create_access_token(data: dict[str, Any]) -> str:
    to_encode = data.copy()
    to_encode["type"] = "access"
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def create_refresh_token(data: dict[str, Any]) -> str:
    to_encode = data.copy()
    to_encode["type"] = "refresh"
    expire = datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def create_totp_pending_token(user_id: str) -> str:
    to_encode = {"sub": user_id, "type": "totp_pending"}
    expire = datetime.utcnow() + timedelta(minutes=5)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def decode_token(token: str) -> dict[str, Any] | None:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return payload
    except JWTError:
        return None


def generate_totp_secret() -> str:
    return pyotp.random_base32()


def get_totp_uri(secret: str, email: str, issuer: str = "My App") -> str:
    totp = pyotp.TOTP(secret)
    return totp.provisioning_uri(name=email, issuer_name=issuer)


def generate_totp_qr_code(secret: str, email: str) -> bytes:
    uri = get_totp_uri(secret, email)
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(uri)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer.getvalue()


def verify_totp(secret: str, code: str) -> bool:
    totp = pyotp.TOTP(secret)
    return totp.verify(code, valid_window=1)
```

**Note**: L'issuer dans `get_totp_uri` doit être remplacé par le nom du projet.

### 3.9 — app/services/s3.py

Générique (sans méthodes métier: upload_company_document, upload_ticket_attachment, upload_offer_pdf, upload_invoice_pdf):

```python
from io import BytesIO
from typing import Any, BinaryIO
from uuid import uuid4

import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

from app.config import settings


class S3Error(Exception):
    def __init__(self, message: str, operation: str | None = None):
        self.message = message
        self.operation = operation
        super().__init__(self.message)


class S3Service:
    def __init__(
        self,
        endpoint_url: str | None = None,
        access_key_id: str | None = None,
        secret_access_key: str | None = None,
        bucket_name: str | None = None,
    ):
        self.endpoint_url = endpoint_url or settings.s3_endpoint_url
        self.access_key_id = access_key_id or settings.s3_access_key_id
        self.secret_access_key = secret_access_key or settings.s3_secret_access_key
        self.bucket_name = bucket_name or settings.s3_bucket_name
        self._client: Any = None

    def _get_client(self) -> Any:
        if self._client is not None:
            return self._client

        if not self.endpoint_url:
            raise S3Error("S3 endpoint URL not configured", operation="init")

        self._client = boto3.client(
            "s3",
            endpoint_url=self.endpoint_url,
            region_name="us-east-1",
            aws_access_key_id=self.access_key_id,
            aws_secret_access_key=self.secret_access_key,
            config=Config(
                signature_version="s3v4",
                s3={"addressing_style": "path"},
                request_checksum_calculation="when_required",
                response_checksum_validation="when_required",
            ),
        )
        return self._client

    def _generate_key(self, prefix: str, filename: str) -> str:
        ext = filename.rsplit(".", 1)[-1] if "." in filename else ""
        unique_id = uuid4().hex[:8]
        safe_filename = f"{unique_id}.{ext}" if ext else unique_id
        return f"{prefix}/{safe_filename}"

    def upload_file(
        self,
        file: BinaryIO,
        key: str,
        content_type: str = "application/octet-stream",
    ) -> str:
        try:
            self._get_client().put_object(
                Bucket=self.bucket_name,
                Key=key,
                Body=file.read(),
                ContentType=content_type,
            )
            return key
        except ClientError as e:
            raise S3Error(f"Upload failed: {e}", operation="upload") from e

    def upload_bytes(
        self,
        data: bytes,
        key: str,
        content_type: str = "application/octet-stream",
    ) -> str:
        return self.upload_file(BytesIO(data), key, content_type)

    def get_presigned_url(
        self,
        key: str,
        expires_in: int = 3600,
        response_content_disposition: str | None = None,
    ) -> str:
        try:
            params: dict[str, Any] = {"Bucket": self.bucket_name, "Key": key}
            if response_content_disposition:
                params["ResponseContentDisposition"] = response_content_disposition
            return self._get_client().generate_presigned_url(
                "get_object",
                Params=params,
                ExpiresIn=expires_in,
            )
        except ClientError as e:
            raise S3Error(f"Failed to generate presigned URL: {e}", operation="presign") from e

    def download_file(self, key: str) -> bytes:
        try:
            response = self._get_client().get_object(Bucket=self.bucket_name, Key=key)
            return response["Body"].read()
        except ClientError as e:
            raise S3Error(f"Download failed: {e}", operation="download") from e

    def delete_file(self, key: str) -> bool:
        try:
            self._get_client().delete_object(Bucket=self.bucket_name, Key=key)
            return True
        except ClientError as e:
            raise S3Error(f"Delete failed: {e}", operation="delete") from e

    def file_exists(self, key: str) -> bool:
        try:
            self._get_client().head_object(Bucket=self.bucket_name, Key=key)
            return True
        except ClientError:
            return False

    def get_file_info(self, key: str) -> dict[str, Any]:
        try:
            response = self._get_client().head_object(Bucket=self.bucket_name, Key=key)
            return {
                "content_type": response.get("ContentType"),
                "content_length": response.get("ContentLength"),
                "last_modified": response.get("LastModified"),
                "etag": response.get("ETag"),
            }
        except ClientError as e:
            raise S3Error(f"Failed to get file info: {e}", operation="head") from e


s3_service = S3Service()
```

### 3.10 — app/api/deps.py

Sans VpsAgent:

```python
from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.database import get_session
from app.models.user import User
from app.services.auth import decode_token

security = HTTPBearer()


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token = credentials.credentials
    payload = decode_token(token)

    if payload is None:
        raise credentials_exception

    token_type = payload.get("type")
    if token_type != "access":
        raise credentials_exception

    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    try:
        user_uuid = UUID(user_id)
    except ValueError:
        raise credentials_exception

    result = await session.execute(select(User).where(User.id == user_uuid))
    user = result.scalar_one_or_none()

    if user is None:
        raise credentials_exception

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )

    return user


async def get_current_admin_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
        )
    return current_user


async def get_current_client_user(
    current_user: Annotated[User, Depends(get_current_user)],
) -> User:
    if current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin users cannot access client portal",
        )
    return current_user


# Type aliases
CurrentUser = Annotated[User, Depends(get_current_user)]
AdminUser = Annotated[User, Depends(get_current_admin_user)]
ClientUser = Annotated[User, Depends(get_current_client_user)]
DbSession = Annotated[AsyncSession, Depends(get_session)]
```

### 3.11 — app/api/auth.py

Endpoints d'authentification. Identique au portail-client mais sans le lazy load de company:

```python
import base64
from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from sqlmodel import select

from app.api.deps import CurrentUser, DbSession
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    MessageResponse,
    RefreshTokenRequest,
    TokenResponse,
    TOTPEnableRequest,
    TOTPSetupResponse,
    TOTPVerifyRequest,
)
from app.schemas.user import UserMeResponse
from app.services.auth import (
    create_access_token,
    create_refresh_token,
    create_totp_pending_token,
    decode_token,
    generate_totp_qr_code,
    generate_totp_secret,
    get_totp_uri,
    verify_password,
    verify_totp,
)

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, session: DbSession) -> LoginResponse:
    result = await session.execute(select(User).where(User.email == request.email))
    user = result.scalar_one_or_none()

    if user is None or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user",
        )

    if user.totp_enabled and user.totp_secret:
        totp_pending_token = create_totp_pending_token(str(user.id))
        return LoginResponse(
            requires_totp=True,
            totp_pending_token=totp_pending_token,
        )

    user.last_login_at = datetime.utcnow()
    session.add(user)

    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/verify-totp", response_model=TokenResponse)
async def verify_totp_code(request: TOTPVerifyRequest, session: DbSession) -> TokenResponse:
    payload = decode_token(request.totp_pending_token)

    if payload is None or payload.get("type") != "totp_pending":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired TOTP token",
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    try:
        user_uuid = UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    result = await session.execute(select(User).where(User.id == user_uuid))
    user = result.scalar_one_or_none()

    if user is None or not user.totp_secret:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    if not verify_totp(user.totp_secret, request.code):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid TOTP code",
        )

    user.last_login_at = datetime.utcnow()
    session.add(user)

    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: RefreshTokenRequest, session: DbSession) -> TokenResponse:
    payload = decode_token(request.refresh_token)

    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    try:
        user_uuid = UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    result = await session.execute(select(User).where(User.id == user_uuid))
    user = result.scalar_one_or_none()

    if user is None or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    new_refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh_token,
    )


@router.get("/me", response_model=UserMeResponse)
async def get_current_user_info(current_user: CurrentUser) -> UserMeResponse:
    return UserMeResponse(
        id=current_user.id,
        email=current_user.email,
        first_name=current_user.first_name,
        last_name=current_user.last_name,
        company_id=current_user.company_id,
        is_admin=current_user.is_admin,
        is_active=current_user.is_active,
        totp_enabled=current_user.totp_enabled,
        created_at=current_user.created_at,
        last_login_at=current_user.last_login_at,
    )


@router.post("/setup-totp", response_model=TOTPSetupResponse)
async def setup_totp(current_user: CurrentUser, session: DbSession) -> TOTPSetupResponse:
    if current_user.totp_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="TOTP is already enabled",
        )

    secret = generate_totp_secret()
    current_user.totp_secret = secret
    session.add(current_user)

    qr_code_bytes = generate_totp_qr_code(secret, current_user.email)
    qr_code_base64 = base64.b64encode(qr_code_bytes).decode("utf-8")

    return TOTPSetupResponse(
        secret=secret,
        qr_code_base64=qr_code_base64,
        provisioning_uri=get_totp_uri(secret, current_user.email),
    )


@router.post("/enable-totp", response_model=MessageResponse)
async def enable_totp(
    request: TOTPEnableRequest,
    current_user: CurrentUser,
    session: DbSession,
) -> MessageResponse:
    if current_user.totp_enabled:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="TOTP is already enabled",
        )

    if not current_user.totp_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="TOTP not set up. Call /setup-totp first.",
        )

    if not verify_totp(current_user.totp_secret, request.code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid TOTP code",
        )

    current_user.totp_enabled = True
    session.add(current_user)

    return MessageResponse(message="TOTP enabled successfully")


@router.post("/disable-totp", response_model=MessageResponse)
async def disable_totp(
    request: TOTPEnableRequest,
    current_user: CurrentUser,
    session: DbSession,
) -> MessageResponse:
    if not current_user.totp_enabled or not current_user.totp_secret:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="TOTP is not enabled",
        )

    if not verify_totp(current_user.totp_secret, request.code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid TOTP code",
        )

    current_user.totp_enabled = False
    current_user.totp_secret = None
    session.add(current_user)

    return MessageResponse(message="TOTP disabled successfully")
```

### 3.12 — app/main.py

```python
from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_db

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    if settings.is_development:
        await init_db()
    yield


app = FastAPI(
    title="My App API",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "healthy"}


from app.api.auth import router as auth_router

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
```

**Note**: Le titre de l'API doit être adapté au nom du projet.

### 3.13 — Alembic

Initialiser Alembic pour les migrations async:

```bash
cd {projet}/backend
uv run alembic init -t async alembic
```

Modifier `alembic/env.py` pour importer les models et utiliser l'URL depuis config:
- Importer `from app.config import settings` et `from app.models.user import User`
- Setter `target_metadata = User.metadata` (ou `SQLModel.metadata`)
- Utiliser `settings.database_url` pour la connexion

Modifier `alembic.ini`:
- Commenter la ligne `sqlalchemy.url` (elle vient du code)

Créer la première migration:
```bash
uv run alembic revision --autogenerate -m "initial"
```

---

## Étape 4 — DevOps

### 4.1 — docker-compose.dev.yml

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app_dev
      POSTGRES_DB: app_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 4.2 — Makefile

```makefile
.PHONY: install dev backend-dev frontend-dev migrate seed

install:
	cd backend && uv sync
	cd frontend && npm install

dev:
	$(MAKE) -j2 backend-dev frontend-dev

backend-dev:
	cd backend && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

frontend-dev:
	cd frontend && npm run dev

migrate:
	cd backend && uv run alembic upgrade head

seed:
	cd backend && uv run python scripts/seed.py
```

### 4.3 — .env.example

```env
# Database
DATABASE_URL=postgresql+asyncpg://app:app_dev@localhost:5432/app_dev

# Security
SECRET_KEY=change-this-to-a-random-string-at-least-32-characters-long

# S3 Storage (optional)
S3_ENDPOINT_URL=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=app-storage

# Frontend
FRONTEND_URL=http://localhost:5173
```

### 4.4 — .gitignore

```gitignore
# Python
__pycache__/
*.py[cod]
*.egg-info/
.venv/
dist/

# Node
node_modules/
dist/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Alembic
alembic/versions/*.pyc
```

---

## Étape 5 — Script de seed

Créer `{projet}/backend/scripts/seed.py`:

```python
"""Seed script to create initial users."""

import asyncio
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlmodel import select

from app.database import async_session_maker, engine, init_db
from app.models.user import User
from app.services.auth import get_password_hash


async def seed() -> None:
    """Create initial admin and client users."""
    await init_db()

    async with async_session_maker() as session:
        # Check if admin already exists
        result = await session.execute(
            select(User).where(User.email == "admin@example.com")
        )
        if result.scalar_one_or_none():
            print("Seed data already exists, skipping.")
            return

        admin = User(
            email="admin@example.com",
            hashed_password=get_password_hash("Admin123!"),
            first_name="Admin",
            last_name="User",
            is_admin=True,
            is_active=True,
        )

        client = User(
            email="client@example.com",
            hashed_password=get_password_hash("Client123!"),
            first_name="Client",
            last_name="User",
            is_admin=False,
            is_active=True,
            company_id="demo-corp",
        )

        session.add(admin)
        session.add(client)
        await session.commit()

        print("Seed completed:")
        print("  Admin: admin@example.com / Admin123!")
        print("  Client: client@example.com / Client123!")


if __name__ == "__main__":
    asyncio.run(seed())
```

---

## Vérification post-scaffold

Après création, vérifier:

1. `cd {projet}/frontend && npm install && npm run dev` → Dashboard shadcn avec Gilroy sur http://localhost:5173
2. `cd {projet}/backend && uv sync` → Dépendances installées
3. `docker compose -f docker-compose.dev.yml up -d` → PostgreSQL démarre
4. `cd {projet}/backend && uv run alembic upgrade head` → Tables créées
5. `cd {projet}/backend && uv run python scripts/seed.py` → Users seedés
6. `cd {projet}/backend && uv run uvicorn app.main:app --reload` → API /health OK
7. Frontend login → Auth fonctionnelle
8. Sidebar affiche Dashboard, Settings, Profile
