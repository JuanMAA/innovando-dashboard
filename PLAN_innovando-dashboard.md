# innovando-dashboard — Plan de trabajo
**Next.js 14 · Supabase · Recharts · Vercel**
Versión 6.0 · Abril 2025

---

## Descripción

Panel de administración interno de Innovando. Repo independiente en `admin.innovando.cl`. Incluye gestión de precios dinámicos por país, reportes de problemas y métricas del informe de huella digital.

---

## URLs

| Ambiente | URL | Supabase |
|---|---|---|
| `dev` | dev-admin.innovando.vercel.app | innovando-test |
| `main` | admin.innovando.cl | innovando-prd |

---

## Stack completo

- Next.js 14 (App Router) · TypeScript
- Tailwind CSS · shadcn/ui · Lucide React
- Recharts · TanStack Table
- React Hook Form + Zod · date-fns
- Supabase (`service_role`)

---

## Instalación

```bash
npx create-next-app@latest . --typescript --tailwind --app
npm install @supabase/ssr @supabase/supabase-js
npx shadcn-ui@latest init
npm install recharts @tanstack/react-table
npm install react-hook-form zod @hookform/resolvers
npm install date-fns lucide-react
```

---

## Estructura de carpetas

```
innovando-dashboard/
├── app/
│   ├── layout.tsx
│   ├── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── contabilidad/page.tsx
│   │   ├── estadisticas/page.tsx
│   │   ├── outreach/page.tsx
│   │   ├── leads/page.tsx
│   │   ├── leads/[slug]/page.tsx
│   │   ├── clientes/page.tsx
│   │   ├── campanas/page.tsx
│   │   ├── problemas/page.tsx
│   │   ├── precios/page.tsx              # Gestión de precios por país
│   │   ├── links/page.tsx
│   │   └── tutoriales/page.tsx
│   └── api/export/pagos/route.ts
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   └── AlertaBanner.tsx
│   ├── ui/
│   │   ├── StatCard.tsx
│   │   ├── Semaforo.tsx
│   │   └── ExportCSV.tsx
│   ├── contabilidad/
│   │   ├── GraficoIngresosMes.tsx
│   │   ├── GraficoIngresosServicio.tsx
│   │   ├── GraficoIngresosCiudad.tsx
│   │   ├── GraficoIngresosPais.tsx       # Nuevo — ingresos por país
│   │   ├── ResumenContable.tsx
│   │   └── TablaIngresos.tsx
│   ├── estadisticas/
│   │   ├── FunnelConversion.tsx
│   │   ├── TasaConversionCiudad.tsx
│   │   ├── GraficoClientesEstado.tsx
│   │   └── GraficoScorePromedio.tsx
│   ├── outreach/
│   │   ├── GraficoEmailsEstado.tsx
│   │   ├── TasaRespuestaCiudad.tsx
│   │   ├── MensajesConversion.tsx
│   │   └── TiempoConversion.tsx
│   ├── leads/
│   │   ├── TablaLeads.tsx
│   │   ├── FiltrosLeads.tsx
│   │   └── FormNotas.tsx
│   ├── clientes/
│   │   ├── TablaClientes.tsx
│   │   └── AlertasRenovacion.tsx
│   ├── campanas/
│   │   └── TablaCampanas.tsx
│   ├── problemas/
│   │   ├── TablaProblemas.tsx
│   │   └── DetalleProblema.tsx
│   ├── precios/
│   │   ├── TablaPrecios.tsx              # Tabla editable de precios por país
│   │   └── FormPrecio.tsx               # Crear/editar precio
│   ├── links/
│   │   ├── TablaLinks.tsx
│   │   └── AlertasLinksRotos.tsx
│   └── tutoriales/
│       ├── TablaTutoriales.tsx
│       └── FormTutorial.tsx
├── lib/supabase/
│   ├── client.ts
│   └── server.ts
├── middleware.ts
├── types/index.ts
├── .env.local
└── package.json
```

---

## Rutas

| URL | Descripción |
|---|---|
| `/login` | Login admin |
| `/` | Resumen general |
| `/contabilidad` | Ingresos por mes, servicio, ciudad, país |
| `/estadisticas` | Funnel, conversión, score |
| `/outreach` | Emails, respuestas, conversión |
| `/leads` | Lista de leads |
| `/leads/[slug]` | Detalle — notas editables |
| `/clientes` | Clientes activos |
| `/campanas` | Campañas por ciudad |
| `/problemas` | Reportes de clientes |
| `/precios` | Gestión de precios por país ⭐ |
| `/links` | Trazabilidad de fuentes |
| `/tutoriales` | CRUD tutoriales DIY |

---

## Gestión de precios por país — `/precios`

El admin define y edita todos los precios desde esta sección. Sin tocar código.

### Vista principal

```
Gestión de precios por país y tipo de negocio

[ + Agregar precio ]   [ Filtrar por país ▾ ]   [ Filtrar por servicio ▾ ]

País         Categoría    Servicio              Precio       Moneda   Estado   Acciones
Chile        todos        reporte_completo      $20.000      CLP      ✅       [Editar] [Desactivar]
Chile        todos        huella_digital        $29.000      CLP      ✅       [Editar] [Desactivar]
Chile        todos        tutorial              $3.000       CLP      ✅       [Editar] [Desactivar]
Chile        todos        sitio_web             $149.000     CLP      ✅       [Editar] [Desactivar]
Colombia     todos        reporte_completo      $45.000      COP      ✅       [Editar] [Desactivar]
Colombia     todos        huella_digital        $69.000      COP      ✅       [Editar] [Desactivar]
Argentina    todos        reporte_completo      $8.500       ARS      ✅       [Editar] [Desactivar]
Bolivia      todos        reporte_completo      65           BOB      ✅       [Editar] [Desactivar]
Perú         todos        reporte_completo      55           PEN      ✅       [Editar] [Desactivar]
```

### Formulario crear/editar precio

```
┌─ Configurar precio ─────────────────────────────────┐
│                                                      │
│ País:        [ Chile ▾ ]                            │
│ Categoría:   [ todos ▾ ]  (hotel, hostal, todos...) │
│ Servicio:    [ reporte_completo ▾ ]                  │
│ Precio:      [ 20000 ]                              │
│ Moneda:      [ CLP ▾ ]                              │
│ Display:     [ $20.000 CLP ]  (auto-generado)       │
│ Activo:      [ ✅ ]                                  │
│                                                      │
│              [ Cancelar ]  [ Guardar ]              │
└──────────────────────────────────────────────────────┘
```

### Fallback automático

Si no hay precio configurado para un país, el sistema usa precio base en USD. El admin puede ver qué países no tienen precios configurados:

```
⚠️ Países sin precios configurados:
México, Ecuador, Venezuela, Paraguay
→ Estos países usan precio base en USD
[ Configurar precios ]
```

---

## Secciones en detalle

### `/` — Resumen general

**Cards:**
```
[ MRR ]  [ Leads este mes ]  [ Tasa conversión ]  [ Clientes activos ]  [ 🔴 Problemas ]
```

**Nuevo widget — Ingresos por país:**
```
Chile         $XXX USD  ████████████  45%
Colombia      $XXX USD  ██████        22%
Argentina     $XXX USD  ████          18%
Perú          $XXX USD  ██            10%
Bolivia       $XXX USD  █              5%
```

**Alertas globales:**
- 🔴 Reportes de problemas pendientes
- 🔴 Links rotos
- 🟡 Renovaciones próximas
- 🔴 Leads sin contactar +10 días
- ⚠️ Países sin precios configurados

---

### `/contabilidad`

**Nuevo gráfico — Ingresos por país:**
Barras horizontales ordenadas por ingreso total. Permite ver qué mercados son más rentables.

**Nuevo filtro en tabla de pagos:** por país y por moneda.

**Métricas adicionales:**
- Ingreso promedio por país
- Conversión por país (qué países pagan más)
- Distribución de servicios por país (en Chile se vende más sitio web, en Colombia más reporte)

---

### `/estadisticas`

**Nuevo — Conversión por país:**
```
País        Leads   Contactados   Pagaron   Tasa conv.
Chile         45        38            8        17.8%
Colombia      32        27            5        15.6%
Argentina     18        14            2        11.1%
```

---

### `/leads/[slug]` — Detalle del lead

Muestra el precio configurado para el país del negocio:

```
Precios aplicados a este negocio (Chile · Hotel):
  Reporte completo:    $20.000 CLP
  Huella digital:      $29.000 CLP
  Tutorial:            $3.000 CLP
  Sitio web:           $149.000 CLP
```

---

### `/problemas`

**Tabla con estados y acciones por tipo:**
- `perfil_equivocado` → Re-análisis completo
- `link_incorrecto` → Re-analizar módulo específico
- `info_desactualizada` → Forzar refresco

---

## Vistas SQL en Supabase

```sql
-- Ingresos por mes y servicio
create view v_ingresos_por_mes as
select date_trunc('month', created_at) as mes, tipo,
  sum(monto) as total, count(*) as cantidad
from pagos where estado = 'aprobado'
group by 1, 2 order by 1 desc;

-- Ingresos por ciudad
create view v_ingresos_por_ciudad as
select n.ciudad, sum(p.monto) as total, count(*) as cantidad
from pagos p join negocios n on p.negocio_id = n.id
where p.estado = 'aprobado'
group by n.ciudad order by total desc;

-- Ingresos por país
create view v_ingresos_por_pais as
select n.pais, sum(p.monto) as total, count(*) as cantidad,
  round(avg(p.monto), 2) as ticket_promedio
from pagos p join negocios n on p.negocio_id = n.id
where p.estado = 'aprobado'
group by n.pais order by total desc;

-- Conversión por ciudad
create view v_conversion_por_ciudad as
select ciudad, count(*) as total_leads,
  count(*) filter (where estado in ('contactado','reporte_pagado','sitio_activo')) as contactados,
  count(*) filter (where estado in ('reporte_pagado','sitio_activo')) as pagaron_reporte,
  count(*) filter (where estado = 'sitio_activo') as pagaron_sitio,
  round(count(*) filter (where estado = 'sitio_activo')::numeric
    / nullif(count(*),0)::numeric * 100, 1) as tasa_conversion
from negocios group by ciudad order by tasa_conversion desc;

-- Conversión por país
create view v_conversion_por_pais as
select pais, count(*) as total_leads,
  count(*) filter (where estado in ('reporte_pagado','sitio_activo')) as pagaron,
  round(count(*) filter (where estado in ('reporte_pagado','sitio_activo'))::numeric
    / nullif(count(*),0)::numeric * 100, 1) as tasa_conversion
from negocios group by pais order by tasa_conversion desc;

-- Outreach por tipo
create view v_outreach_por_tipo as
select tipo, count(*) as enviados,
  count(*) filter (where estado = 'abierto') as abiertos,
  count(*) filter (where estado = 'respondio') as respondidos,
  round(count(*) filter (where estado = 'respondio')::numeric
    / nullif(count(*),0)::numeric * 100, 1) as tasa_respuesta
from outreach group by tipo order by tasa_respuesta desc;

-- Problemas pendientes
create view v_problemas_pendientes as
select r.*, n.nombre, n.ciudad, n.pais, n.slug
from reportes_problema r
join negocios n on r.negocio_id = n.id
where r.estado = 'pendiente'
order by r.reportado_at desc;

-- Países sin precios configurados
create view v_paises_sin_precios as
select distinct n.pais
from negocios n
where n.pais not in (
  select distinct pais from precios_por_pais where activo = true
);
```

---

## Escalabilidad futura

| Fase | Qué se agrega |
|---|---|
| Revendedores por ciudad | Tabla `usuarios` + Supabase RLS |
| Equipo interno | Roles: admin / outreach / soporte |
| Portal de clientes | `app.innovando.cl` |

---

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=https://admin.innovando.cl
NEXT_PUBLIC_SITE_URL=https://innovando.cl
APP_ENV=prd
```

---

## Fases de construcción

### FASE 0 — Configuración
- [ ] Crear repo `innovando-dashboard` en GitHub (privado)
- [ ] Crear ramas `main` y `dev`
- [ ] Crear proyecto Vercel + subdominio `admin.innovando.cl`
- [ ] Crear vistas SQL en Supabase
- [ ] Cargar tabla `precios_por_pais` con configuración inicial

### FASE 1 — Next.js base + auth
- [ ] Crear proyecto con dependencias
- [ ] Middleware + `/login` + usuario admin en Supabase Auth

### FASE 2 — Layout y navegación
- [ ] Sidebar con link a `/precios` y `/problemas`
- [ ] Topbar con badge de problemas pendientes
- [ ] AlertaBanner con alertas incluyendo países sin precios

### FASE 3 — Resumen general
- [ ] Cards KPIs + widget ingresos por país + alertas

### FASE 4 — Contabilidad
- [ ] Gráficos por mes, servicio, ciudad + nuevo gráfico por país
- [ ] Filtro por país en tabla de pagos

### FASE 5 — Estadísticas
- [ ] Funnel + conversión por ciudad + conversión por país

### FASE 6 — Outreach
- [ ] Gráficos + tablas de mensajes

### FASE 7 — Leads con notas y precios
- [ ] TablaLeads con filtros
- [ ] `/leads/[slug]` con FormNotas + precios aplicados al negocio

### FASE 8 — Gestión de precios ⭐
- [ ] `/precios` — TablaPrecios con filtros
- [ ] FormPrecio — crear/editar/desactivar
- [ ] Vista de países sin precios configurados
- [ ] Auto-generación de `precio_display` desde precio + moneda

### FASE 9 — Problemas
- [ ] TablaProblemas + DetalleProblema con acciones

### FASE 10 — Clientes y campañas
- [ ] TablaClientes + AlertasRenovacion
- [ ] TablaCampanas

### FASE 11 — Links y tutoriales
- [ ] TablaLinks + verificación HTTP
- [ ] TablaTutoriales + FormTutorial CRUD

---

## Convenciones

- Client Components por defecto
- Server Components solo para sesión y layout
- Nunca exponer `SUPABASE_SERVICE_ROLE_KEY` al cliente
- Commits: `feat:` `fix:` `chore:` `docs:`
- Ramas: `main` (prd) · `dev` (test) · `feat/nombre`

---

*innovando-dashboard · v6.0 · Next.js 14 + Supabase + Recharts*
*admin.innovando.cl · Parte del proyecto Innovando*
