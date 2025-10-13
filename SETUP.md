# Guía de Instalación

## Configuración Rápida

### 1. Base de Datos

**Opción Recomendada: Neon (gratis)**
1. Ir a [neon.tech](https://neon.tech)
2. Crear proyecto PostgreSQL
3. Copiar connection string

**Alternativa: PostgreSQL Local**
```powershell
psql -U postgres
CREATE DATABASE boda_estelle;
\q
```

### 2. Variables de Entorno

```powershell
Copy-Item .env.example .env
notepad .env
```

**Mínimo requerido:**
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAILS="admin@example.com"
```

### 3. Instalación

```powershell
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed  # Opcional: datos de ejemplo
npm run dev
```

## Blob Storage (Para Fotos)

**Opción 1: Cloudflare R2** (Recomendado)
```env
BLOB_ENDPOINT="https://[account].r2.cloudflarestorage.com"
BLOB_ACCESS_KEY_ID="..."
BLOB_SECRET_ACCESS_KEY="..."
BLOB_BUCKET="boda-estelle"
```

**Opción 2: Supabase Storage**
```env
BLOB_ENDPOINT="https://[project].supabase.co/storage/v1/s3"
BLOB_ACCESS_KEY_ID="..."
BLOB_SECRET_ACCESS_KEY="..."
BLOB_BUCKET="boda-estelle"
```

## Personalización

1. **Información de la boda**: `src/app/informacion/page.tsx`
2. **Página inicio**: `src/app/page.tsx`
3. **Colores**: `src/lib/theme.ts`
4. **Contenido**: Usa Prisma Studio (`npx prisma studio`)

## Despliegue en Vercel

1. Conectar repo en vercel.com
2. Configurar variables de entorno
3. Deploy automático

## Solución de Problemas

**Error de conexión a BD**
```powershell
# Verifica DATABASE_URL en .env
npx prisma migrate dev
```

**Error de Prisma**
```powershell
npx prisma generate
```

---

Más info: README.md
