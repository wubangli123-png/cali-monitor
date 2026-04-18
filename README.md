# Cali Monitor

**Sala de situación digital para la administración pública de Santiago de Cali, Colombia.**

<img src="public/fc17a005-cf32-4b77-a988-fcd44110d42d.jpg" width="600">

Cali Monitor centraliza en un único panel operativo la información pública que impacta la gestión municipal: noticias de medios locales clasificadas por secretaría, contratos del SECOP II y actividad por barrio. Está diseñado para que equipos de gobierno tomen decisiones con contexto, sin tener que consultar docenas de fuentes por separado.

---

## ¿Qué hace?

### Monitoreo de noticias
Agrega y clasifica automáticamente noticias de fuentes locales (Google News, Q'Hubo Cali, Occidente, 90 Minutos, Alcaldía de Cali) en 13 categorías alineadas a la estructura municipal: Seguridad Pública, Salud, Educación, Infraestructura, Movilidad, Medio Ambiente, Desarrollo Social, Desarrollo Económico, Gobernanza, Judicial, Cultura, Emergencias y General.

Cada noticia es procesada por `gpt-4o-mini` para asignarle categoría y detectar el barrio de Cali mencionado, lo que permite visualizar en un mapa interactivo dónde se concentra la actividad informativa de la ciudad.

### Contratos SECOP II
Consulta en tiempo real los contratos públicos registrados por entidades de Cali en el Sistema Electrónico de Contratación Pública. Permite filtrar por fechas de firma y explorar los contratos en vista de módulos o tabla. Los datos provienen de la API abierta de datos.gov.co y se cachean por 30 minutos para no saturar el servicio.

---

## Panel operativo

El dashboard presenta:
- **KPIs en tiempo real** — total de registros, actividad de las últimas 24h, fuentes activas, tópicos con cobertura
- **Resumen ejecutivo generado por IA** — síntesis de los titulares del día en lenguaje formal para equipos directivos
- **Mapa de incidencias por barrio** — 339 barrios oficiales de Cali (IDESC), con polígonos y marcadores coloreados por tópico
- **Distribución por categoría** — barras proporcionales de cobertura en las últimas 24h
- **Actividad semanal** — volumen de noticias por día en los últimos 7 días
- **Nube de palabras** — términos más frecuentes en las últimas 24h
- **Filtros en tiempo real** — por tópico y barrio, sin recargar la página

---

## Potencial

Cali Monitor está construido como una plataforma extensible. Las líneas de desarrollo más inmediatas son:

- **Más fuentes de datos públicos** — integración con otros datasets de datos.gov.co: licitaciones abiertas, presupuesto ejecutado, PQRS ciudadanas, indicadores de seguridad
- **Búsqueda avanzada de contratos** — filtros por entidad, tipo de contrato, rango de valor y búsqueda de texto libre en el objeto del contrato
- **Alertas automáticas** — notificaciones cuando se publican contratos de alto valor o noticias en categorías críticas
- **Comparación histórica** — evolución temporal de contratación por secretaría o tópico
- **Acceso multiusuario** — panel diferenciado por dependencia, con vista personalizada para cada secretaría

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend / Backend | Next.js 15 (App Router + TypeScript) |
| Base de datos | Supabase (PostgreSQL) |
| Clasificación IA | OpenAI gpt-4o-mini |
| Contratos públicos | API Socrata — datos.gov.co (SECOP II) |
| Mapa | Leaflet + datos geográficos IDESC Cali |
| Deploy | Vercel (ISR + Cron Jobs) |

---

## Instalación local

```bash
git clone https://github.com/cardonanl/cali-monitor.git
cd cali-monitor
npm install
cp .env.example .env.local   # completar con las keys
npm run dev
```

### Variables de entorno

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Key pública (lectura) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (escritura server-side) |
| `OPENAI_API_KEY` | Key de OpenAI |
| `RECLASSIFY_SECRET` | Token para `POST /api/reclassify` |
| `CRON_SECRET` | Generado por Vercel — protege `GET /api/classify` |

---

## Scripts de administración

```bash
# Reclasificar todos los artículos
curl -X POST https://cali-monitor.vercel.app/api/reclassify \
  -H "Authorization: Bearer TU_RECLASSIFY_SECRET"

# Regenerar el GeoJSON de barrios desde el shapefile fuente
node scripts/convert-barrios.mjs
```

---

## Demo

[https://cali-monitor.vercel.app](https://cali-monitor.vercel.app)

---

*Creado por Nicolás Cardona*
