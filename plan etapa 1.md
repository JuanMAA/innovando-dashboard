# innovando-dashboard — Etapa 1
**Next.js 14 · Supabase · Vercel**
Versión Etapa 1 v3 · Mayo 2025

---

## Objetivo

Panel mínimo para gestionar los primeros 15 leads de Ancud.
Completar contactos faltantes, ver redes detectadas y gestionar problemas reportados.

---

## URLs

| Ambiente | URL | Supabase |
|---|---|---|
| dev | dev-admin.innovando.vercel.app | innovando-test |
| main | admin.innovando.cl | innovando-prd |

---

## Stack

```
Next.js 14 (App Router) · TypeScript
Tailwind CSS · shadcn/ui · Lucide React
TanStack Table
Supabase (service_role)
```

---

## Instalación

```bash
npx create-next-app@latest . --typescript --tailwind --app
npm install @supabase/ssr @supabase/supabase-js
npx shadcn-ui@latest init
npm install @tanstack/react-table lucide-react
```

---

## Rutas

| URL | Descripción |
|---|---|
| `/login` | Login admin (email + password) |
| `/` | Resumen — KPIs y alertas |
| `/ciudades` | Estado de ciudades procesadas |
| `/leads` | Lista de leads con filtros |
| `/leads/[slug]` | Detalle — contacto, redes, notas |
| `/problemas` | Reportes de clientes |

---

## Estructura

```
innovando-dashboard/
├── app/
│   ├── layout.tsx
│   ├── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx             # Sidebar + topbar
│   │   ├── page.tsx               # Resumen
│   │   ├── ciudades/page.tsx
│   │   ├── leads/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── problemas/page.tsx
├── components/
│   ├── layout/Sidebar.tsx + Topbar.tsx
│   ├── leads/
│   │   ├── TablaLeads.tsx
│   │   ├── FiltrosLeads.tsx
│   │   ├── FormContacto.tsx        # Editar email, WhatsApp, fuente
│   │   └── FormRedes.tsx           # Ver y editar redes sociales
│   ├── ciudades/TablaCiudades.tsx
│   └── problemas/
│       ├── TablaProblemas.tsx
│       └── DetalleProblema.tsx
├── lib/supabase/client.ts + server.ts
├── middleware.ts
└── types/index.ts
```

---

## `/` — Resumen

Cards con el estado actual:

```
[ Total leads ]  [ Con email ]  [ Sin email ]  [ Reportes ]  [ Problemas ]
[     15      ]  [     9     ]  [     6     ]  [    12    ]  [     1     ]
```

**Alertas activas:**
- 🔴 6 leads sin contacto — completar en dashboard
- 🟡 3 leads con reporte sin enviar email
- 🔴 1 problema reportado pendiente

---

## `/ciudades`

```
Ciudad    País   Status       Leads  Email  Lighthouse  Última corrida
Ancud     Chile  ✅ done        15      9       8/15     hace 2 días
Castro    Chile  ⏳ pending      —      —        —        —
```

---

## `/leads` — Lista con filtros

**Filtros disponibles:**
- Ciudad
- Status: new | analyzed | contacted | report_paid
- Requiere relleno: sí / no
- Tiene email: sí / no
- Tiene sitio web: sí / no
- Lighthouse action: optimizar | reemplazar | mantener

**Tabla:**
```
Nombre               Score   Email           Redes      LH    Status
Hostal Vista al Mar  41/100  ✅ web          IG · FB    🔴42  contacted
Restaurant El Canelo 67/100  ❌ faltante     IG         🟡61  analyzed
Cabaña del Sur       52/100  ❌ faltante     —          —     new
```

**Filtro rápido:** botón "Solo requieren relleno" — destacado en rojo.

---

## `/leads/[slug]` — Detalle

### Sección 1 — Datos del negocio
- Nombre, categoría, ciudad, dirección, status
- Score total + scores por módulo (P2a–P2f)
- Links: reporte público, Google Maps
- Datos de Google Maps: rating, reviews, photos, price_level

### Sección 2 — Contacto (editable)

```
┌─ Contacto ──────────────────────────────────────┐
│  Email:    [contacto@hostal.cl]  Fuente: web    │
│  WhatsApp: [+56 9 1234 5678]     Fuente: IG     │
│  Teléfono: +56 65 123456         Fuente: Maps   │
│                                                  │
│  + Agregar email / + Agregar teléfono           │
│                       [ Guardar cambios ]        │
└──────────────────────────────────────────────────┘
```

Muestra todos los emails y teléfonos de `business_emails` y `business_phones`.
Admin puede marcar cuál es el primario.

### Sección 3 — Redes sociales

```
┌─ Redes detectadas ──────────────────────────────┐
│  📸 Instagram: instagram.com/hostalvistaalmar   │
│  📘 Facebook:  facebook.com/hostalvistaalmar    │
│  ❌ TikTok:    no detectado                     │
│                                                  │
│  Fuente: sitio web · scorer_web                 │
│                           [ Editar ] [ + Agregar]│
└──────────────────────────────────────────────────┘
```

### Sección 4 — Lighthouse

```
┌─ Auditoría Lighthouse ──────────────────────────┐
│  Performance:   42/100 🔴    SEO:       61/100 🟡│
│  Accessibility: 54/100 🟡    Best Prac: 78/100 🟢│
│  LCP: 6.2s  FCP: 2.1s  TBT: 420ms  CLS: 0.12  │
│                                                  │
│  Acción recomendada: optimizar ($79.000 CLP)    │
└──────────────────────────────────────────────────┘
```

### Sección 5 — Notas del reporte (editables)

Muestra la `general_note` y la nota de cada módulo.
Admin puede editar directamente — se marca `note_edited = true`.

### Sección 6 — Historial de outreach

```
📧 Email enviado · hace 3 días · contacto@hostal.cl
   Asunto: Tu presencia digital en Google: 41/100
```

### Sección 7 — Acciones

```
[ Ver reporte público → ]  [ Enviar email ahora ]  [ Marcar como perdido ]
```

---

## `/problemas`

```
Status  Negocio              Tipo               Hace      Acción
🔴 new  Hostal Vista al Mar  wrong_profile      2 horas   [Ver]
✅ done Restaurant El Canelo info_outdated      3 días    [Ver]
```

**Detalle de un problema:**
- Tipo + descripción del cliente
- Acciones: Re-analizar / Editar nota / Marcar resuelto / Ignorar
- Nota interna del admin

---

## Nomenclatura en código

Usar siempre los nombres en inglés de la base de datos:

```typescript
// ✅ Correcto
business.status       // no .estado
business.name         // no .nombre
business.city         // no .ciudad
business.country      // no .pais
business.rating       // no .calificacion
business.has_hours    // no .tiene_horarios
payment.type          // no .tipo
payment.status        // no .estado
payment.platform      // no .plataforma
```

---

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=https://admin.innovando.cl
NEXT_PUBLIC_REPORTES_URL=https://reportes.innovando.cl
APP_ENV=prd
```

---

## Fases de construcción

### FASE 0 — Configuración
- [ ] Repo `innovando-dashboard` → GitHub (privado)
- [ ] Conectar a Vercel → `admin.innovando.cl`
- [ ] Variables de entorno por rama

### FASE 1 — Auth + layout
- [ ] Middleware protege todas las rutas salvo `/login`
- [ ] `/login` con Supabase Auth
- [ ] Crear usuario admin en Supabase Auth
- [ ] Sidebar con links
- [ ] Topbar con logout

### FASE 2 — Resumen
- [ ] Cards de KPIs
- [ ] Alertas activas

### FASE 3 — Ciudades
- [ ] `TablaCiudades` con status y stats

### FASE 4 — Leads
- [ ] `TablaLeads` con todos los filtros
- [ ] `/leads/[slug]` — todas las secciones
- [ ] `FormContacto` — editar con `business_emails` / `business_phones`
- [ ] Sección redes — leer de `business_socials`
- [ ] Sección Lighthouse — desde `business_data.lighthouse`
- [ ] Editor de notas del reporte

### FASE 5 — Problemas
- [ ] `TablaProblemas`
- [ ] `DetalleProblema` con acciones

---

## Convenciones

- Client Components por defecto (interactividad constante)
- Server Components solo para layout raíz y auth
- Nunca exponer `SUPABASE_SERVICE_ROLE_KEY` al cliente
- Siempre usar nombres de campo en inglés
- Commits: `feat:` `fix:` `chore:` `docs:`
- Ramas: `main` (prd) · `dev` (test) · `feat/nombre`

---

*innovando-dashboard · Etapa 1 v3 · Next.js 14 + Supabase*
*admin.innovando.cl · Meta: gestionar los primeros 15 leads*