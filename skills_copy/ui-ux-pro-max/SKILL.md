---
name: ui-ux-pro-max
description: Guide de design UI/UX complet avec styles, couleurs, typographie et best practices
argument-hint: "[product-type] [style-keywords]"
---

# UI/UX Pro Max - Design Intelligence

Guide complet pour le design d'applications web et mobile. Contient des styles, palettes de couleurs, associations typographiques, guidelines UX et recommandations par stack.

## Quand appliquer ce skill

Utilise ces guidelines pour :
- Designer de nouveaux composants ou pages
- Choisir des palettes de couleurs et typographies
- Review de code pour les problèmes UX
- Créer des landing pages ou dashboards
- Implémenter les exigences d'accessibilité

---

## Règles par priorité

### 1. Accessibilité (CRITICAL)

| Règle | Description | Implémentation |
|-------|-------------|----------------|
| color-contrast | Ratio minimum 4.5:1 pour le texte | Utiliser des outils comme WebAIM |
| focus-states | Anneaux de focus visibles | `focus:ring-2 focus:ring-primary` |
| alt-text | Alt descriptif pour les images | `<img alt="Description précise">` |
| aria-labels | aria-label pour boutons icône | `<button aria-label="Fermer">` |
| keyboard-nav | Ordre de tab = ordre visuel | Vérifier tabindex |
| form-labels | Label avec for attribute | `<label for="email">Email</label>` |

### 2. Touch & Interaction (CRITICAL)

| Règle | Description | Implémentation |
|-------|-------------|----------------|
| touch-target-size | Minimum 44x44px | `min-h-11 min-w-11` |
| hover-vs-tap | Click/tap pour actions primaires | Éviter hover-only |
| loading-buttons | Désactiver pendant async | `disabled={isPending}` |
| error-feedback | Messages clairs près du problème | Toast ou inline error |
| cursor-pointer | Sur tous les éléments cliquables | `cursor-pointer` |

### 3. Performance (HIGH)

| Règle | Description | Implémentation |
|-------|-------------|----------------|
| image-optimization | WebP, srcset, lazy loading | `loading="lazy"` |
| reduced-motion | Respecter prefers-reduced-motion | `motion-safe:animate-*` |
| content-jumping | Réserver l'espace pour contenu async | Skeleton loaders |

### 4. Layout & Responsive (HIGH)

| Règle | Description | Implémentation |
|-------|-------------|----------------|
| viewport-meta | width=device-width | Meta viewport standard |
| readable-font-size | Minimum 16px body sur mobile | `text-base` minimum |
| horizontal-scroll | Contenu dans viewport | `overflow-x-hidden` |
| z-index-management | Échelle définie (10, 20, 30, 50) | Variables CSS |

### 5. Typography & Color (MEDIUM)

| Règle | Description | Implémentation |
|-------|-------------|----------------|
| line-height | 1.5-1.75 pour body | `leading-relaxed` |
| line-length | 65-75 caractères max | `max-w-prose` |
| font-pairing | Harmoniser heading/body | Voir associations ci-dessous |

### 6. Animation (MEDIUM)

| Règle | Description | Implémentation |
|-------|-------------|----------------|
| duration-timing | 150-300ms pour micro-interactions | `duration-200` |
| transform-performance | Utiliser transform/opacity | Pas width/height |
| loading-states | Skeleton ou spinners | Composants dédiés |

---

## Styles UI par type de produit

### SaaS / Dashboard
- **Style**: Clean, fonctionnel, data-driven
- **Couleurs**: Bleus froids, gris neutres, accents vifs pour actions
- **Fonts**: Inter, SF Pro, Geist (sans-serif technique)
- **Effets**: Ombres subtiles, bordures fines, glassmorphism léger

### E-commerce
- **Style**: Confiance, clarté, call-to-action forts
- **Couleurs**: Blanc dominant, accents de marque, vert pour succès
- **Fonts**: System fonts rapides, lisibilité maximale
- **Effets**: Cards produit, hover zoom, badges

### Portfolio / Creative
- **Style**: Expressif, unique, storytelling
- **Couleurs**: Contrastes forts, monochrome ou palette signature
- **Fonts**: Display fonts pour headings, serif élégant
- **Effets**: Animations créatives, parallax, transitions fluides

### Landing Page
- **Style**: Hero-centric, conversion-focused
- **Couleurs**: Gradient hero, CTA contrasté, social proof subtil
- **Fonts**: Bold headings (Clash, Cabinet), clean body
- **Effets**: Scroll animations, sticky CTA, testimonials slider

### Healthcare / Wellbeing
- **Style**: Calme, confiance, professionnel
- **Couleurs**: Bleus apaisants, verts naturels, blancs propres
- **Fonts**: Humanist sans-serif (Nunito, Open Sans)
- **Effets**: Transitions douces, espacements généreux

### Fintech / Crypto
- **Style**: Moderne, sécurisé, données en temps réel
- **Couleurs**: Dark mode, néons (cyan, violet), gradients
- **Fonts**: Geometric (Space Grotesk, Outfit)
- **Effets**: Glassmorphism, glow effects, charts animés

---

## Palettes de couleurs recommandées

### Mode clair - Professionnel
```css
--background: #FFFFFF;
--foreground: #0F172A;      /* slate-900 */
--muted: #F1F5F9;           /* slate-100 */
--muted-foreground: #64748B; /* slate-500 */
--primary: #2563EB;         /* blue-600 */
--primary-foreground: #FFFFFF;
--destructive: #DC2626;     /* red-600 */
--border: #E2E8F0;          /* slate-200 */
```

### Mode sombre - Moderne
```css
--background: #09090B;      /* zinc-950 */
--foreground: #FAFAFA;      /* zinc-50 */
--muted: #18181B;           /* zinc-900 */
--muted-foreground: #A1A1AA; /* zinc-400 */
--primary: #3B82F6;         /* blue-500 */
--primary-foreground: #FFFFFF;
--destructive: #EF4444;     /* red-500 */
--border: #27272A;          /* zinc-800 */
```

### Accent - Fintech/Tech
```css
--accent-cyan: #06B6D4;
--accent-violet: #8B5CF6;
--accent-emerald: #10B981;
--gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

---

## Associations typographiques

| Usage | Heading | Body | Caractère |
|-------|---------|------|-----------|
| SaaS Modern | Inter Bold | Inter Regular | Clean, technique |
| Élégant | Playfair Display | Lora | Luxe, raffiné |
| Playful | Clash Display | DM Sans | Dynamique, jeune |
| Corporate | Outfit | Source Sans 3 | Professionnel |
| Editorial | Fraunces | Libre Baskerville | Journalistique |
| Tech/Crypto | Space Grotesk | Space Mono | Futuriste |
| Minimal | Geist | Geist | Apple-like |

---

## Règles visuelles obligatoires

### Icons & Visual Elements
| Faire | Ne pas faire |
|-------|--------------|
| Utiliser SVG (Heroicons, Lucide) | Utiliser des emojis comme icônes UI |
| Transitions color/opacity au hover | Scale transforms qui décalent le layout |
| Logos officiels (Simple Icons) | Deviner les logos |
| Tailles d'icônes fixes (w-6 h-6) | Mélanger différentes tailles |

### Interaction & Cursor
| Faire | Ne pas faire |
|-------|--------------|
| `cursor-pointer` sur cliquables | Laisser le curseur par défaut |
| Feedback visuel au hover | Aucune indication d'interactivité |
| `transition-colors duration-200` | Changements instantanés |

### Contraste Light/Dark
| Faire | Ne pas faire |
|-------|--------------|
| Glass cards: `bg-white/80` en light | `bg-white/10` (trop transparent) |
| Texte: `slate-900` en light | `slate-400` pour body text |
| Bordures: `border-gray-200` en light | `border-white/10` (invisible) |

### Layout
| Faire | Ne pas faire |
|-------|--------------|
| Navbar flottante: `top-4 left-4 right-4` | Collée `top-0 left-0 right-0` |
| Prévoir hauteur navbar | Contenu caché derrière fixed |
| `max-w-6xl` ou `max-w-7xl` consistant | Mélanger différentes largeurs |

---

## Checklist pré-livraison

### Qualité visuelle
- [ ] Pas d'emojis comme icônes (SVG uniquement)
- [ ] Icônes d'un set consistant (Heroicons/Lucide)
- [ ] Logos de marques vérifiés (Simple Icons)
- [ ] Hover states sans décalage du layout
- [ ] Couleurs via classes directes (`bg-primary`) pas `var()`

### Interaction
- [ ] Tous les cliquables ont `cursor-pointer`
- [ ] Feedback visuel au hover clair
- [ ] Transitions fluides (150-300ms)
- [ ] Focus states visibles pour navigation clavier

### Light/Dark Mode
- [ ] Texte light mode avec contraste suffisant (4.5:1 min)
- [ ] Éléments glass/transparent visibles en light
- [ ] Bordures visibles dans les deux modes
- [ ] Testé dans les deux modes avant livraison

### Layout
- [ ] Éléments flottants espacés des bords
- [ ] Pas de contenu caché sous navbar fixe
- [ ] Responsive à 375px, 768px, 1024px, 1440px
- [ ] Pas de scroll horizontal sur mobile

### Accessibilité
- [ ] Toutes les images ont un alt text
- [ ] Tous les inputs ont des labels
- [ ] La couleur n'est pas le seul indicateur
- [ ] `prefers-reduced-motion` respecté

---

## Guidelines par stack

### Tailwind CSS (défaut)
```html
<!-- Touch target minimum -->
<button class="min-h-11 min-w-11 p-3 cursor-pointer">

<!-- Focus states -->
<input class="focus:ring-2 focus:ring-primary focus:outline-none">

<!-- Responsive text -->
<p class="text-base md:text-lg leading-relaxed max-w-prose">

<!-- Transitions -->
<div class="transition-colors duration-200 hover:bg-muted">

<!-- Reduced motion -->
<div class="motion-safe:animate-fade-in">
```

### React/Next.js
```tsx
// Loading button pattern
<Button disabled={isPending}>
  {isPending ? <Spinner /> : "Submit"}
</Button>

// Accessible icon button
<button aria-label="Close menu" className="cursor-pointer">
  <X className="h-5 w-5" />
</button>

// Image optimization
<Image
  src="/hero.webp"
  alt="Description précise"
  priority={isAboveFold}
  loading={isAboveFold ? undefined : "lazy"}
/>
```

### shadcn/ui
```tsx
// Utiliser les variantes correctement
<Button variant="destructive" size="lg">
  Delete
</Button>

// Toast pour feedback
const { toast } = useToast()
toast({ title: "Saved", description: "Changes applied" })

// Form avec validation
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

## Workflow recommandé

1. **Identifier le type de produit** (SaaS, e-commerce, portfolio, etc.)
2. **Choisir le style** correspondant à la cible
3. **Appliquer la palette** de couleurs adaptée
4. **Sélectionner les fonts** qui matchent le caractère
5. **Implémenter** en suivant les règles par priorité (CRITICAL d'abord)
6. **Vérifier** avec la checklist avant livraison
7. **Tester** accessibilité, responsive, dark mode
