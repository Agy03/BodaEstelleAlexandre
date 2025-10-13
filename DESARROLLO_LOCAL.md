# 🚀 Configuración Rápida para Desarrollo Local

Este archivo te ayuda a empezar rápidamente con PostgreSQL local y sin blob storage.

## Copiar a .env para empezar

```env
# Base de Datos Local (asume PostgreSQL corriendo en localhost)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/boda_estelle?schema=public"

# NextAuth (cambiar en producción)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-change-in-production-use-openssl-rand-base64-32"

# Admin Emails
ADMIN_EMAILS="admin@example.com"

# Email (opcional - comentar si no usas)
# EMAIL_SERVER="smtp://user:pass@smtp.gmail.com:587"
# EMAIL_FROM="noreply@example.com"

# Blob Storage (opcional - comentar si no usas subida de fotos por ahora)
# BLOB_ENDPOINT="https://s3.amazonaws.com"
# BLOB_REGION="us-east-1"
# BLOB_ACCESS_KEY_ID="your-key"
# BLOB_SECRET_ACCESS_KEY="your-secret"
# BLOB_BUCKET="boda-estelle-photos"
```

## Pasos para PostgreSQL Local

### Windows

1. **Instalar PostgreSQL**:
   - Descargar de https://www.postgresql.org/download/windows/
   - Durante instalación, establecer contraseña para usuario `postgres`

2. **Crear base de datos**:
   ```powershell
   # Abrir psql
   psql -U postgres
   
   # Crear base de datos
   CREATE DATABASE boda_estelle;
   
   # Salir
   \q
   ```

3. **Actualizar DATABASE_URL en .env** si usaste otra contraseña:
   ```env
   DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/boda_estelle?schema=public"
   ```

### macOS (Homebrew)

```bash
# Instalar PostgreSQL
brew install postgresql@16
brew services start postgresql@16

# Crear base de datos
createdb boda_estelle

# DATABASE_URL en .env
DATABASE_URL="postgresql://$(whoami)@localhost:5432/boda_estelle?schema=public"
```

### Linux (Ubuntu/Debian)

```bash
# Instalar PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Cambiar a usuario postgres
sudo -u postgres psql

# Crear base de datos
CREATE DATABASE boda_estelle;

# Crear usuario (opcional)
CREATE USER bodauser WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE boda_estelle TO bodauser;

# Salir
\q
```

## Alternativa: Docker PostgreSQL

Si prefieres usar Docker:

```powershell
# Iniciar PostgreSQL con Docker Compose
docker-compose up db -d

# La base de datos ya está configurada con:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/boda_estelle?schema=public"
```

## Sin Blob Storage (desarrollo inicial)

Si no necesitas subir fotos inmediatamente, puedes:

1. Comentar las variables `BLOB_*` en `.env`
2. La función de galería estará disponible pero no funcionará hasta configurar storage
3. El resto de la aplicación funcionará perfectamente

## Probar que Funciona

```powershell
# 1. Generar cliente Prisma
npx prisma generate

# 2. Aplicar migraciones
npx prisma migrate dev --name init

# 3. (Opcional) Cargar datos de ejemplo
npx prisma db seed

# 4. Iniciar servidor
npm run dev
```

Abre http://localhost:3000 y verifica que carga.

## Siguiente Paso: Configuración en la Nube (Recomendado)

Para no tener que mantener PostgreSQL local:

### Opción 1: Neon (PostgreSQL Serverless) - GRATIS
1. Ir a https://neon.tech
2. Crear cuenta gratis
3. Crear nuevo proyecto
4. Copiar connection string a `DATABASE_URL`

### Opción 2: Supabase (PostgreSQL + Storage) - GRATIS
1. Ir a https://supabase.com
2. Crear proyecto gratuito
3. Copiar connection string (cambia el pooling a direct connection)
4. Usar Supabase Storage para fotos

### Opción 3: Railway - Fácil de usar
1. Ir a https://railway.app
2. Crear proyecto PostgreSQL
3. Copiar connection string

## Configuración Mínima Funcional

Para empezar rápido, solo necesitas:

```env
DATABASE_URL="postgresql://..." # Tu base de datos
NEXTAUTH_SECRET="cualquier-string-largo-aleatorio"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAILS="tu-email@example.com"
```

¡Todo lo demás es opcional para comenzar!

## Problemas Comunes

### "Can't connect to database"
- Verifica que PostgreSQL está corriendo
- Verifica la contraseña en `DATABASE_URL`
- Verifica que el puerto 5432 no está bloqueado

### "Port 3000 already in use"
```powershell
# Encontrar y matar el proceso
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

### "Prisma Client not generated"
```powershell
npx prisma generate
```

---

💡 **Tip**: Una vez que funcione en local, migra a una base de datos en la nube para no depender de tener PostgreSQL corriendo localmente.
