# 🚀 Guía de Comandos para Boda Estelle

## 📦 Instalación Inicial

```powershell
# 1. Instalar todas las dependencias
npm install

# 2. Instalar tsx para el seed (si no se instaló automáticamente)
npm install -D tsx

# 3. Crear archivo .env desde el ejemplo
Copy-Item .env.example .env

# 4. Editar .env con tus credenciales
notepad .env
```

## 🗄️ Comandos de Base de Datos

### Primera vez (Setup completo)
```powershell
# Generar el cliente de Prisma
npx prisma generate

# Crear y aplicar la migración inicial
npx prisma migrate dev --name init

# (Opcional) Cargar datos de ejemplo
npx prisma db seed
```

### Comandos útiles
```powershell
# Ver la base de datos en el navegador (Prisma Studio)
npx prisma studio

# Crear una nueva migración después de cambios en schema.prisma
npx prisma migrate dev --name nombre_de_la_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Regenerar el cliente de Prisma
npx prisma generate

# Formatear el schema.prisma
npx prisma format

# Resetear la base de datos (¡cuidado! borra todo)
npx prisma migrate reset
```

## 🏃 Desarrollo

```powershell
# Iniciar servidor de desarrollo
npm run dev

# Iniciar en un puerto específico
$env:PORT=3001; npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm run start

# Ejecutar linting
npm run lint
```

## 🐳 Docker

### Usando solo PostgreSQL
```powershell
# Iniciar solo la base de datos
docker-compose up db -d

# Ver logs
docker-compose logs -f db

# Detener
docker-compose down
```

### Aplicación completa
```powershell
# Construir e iniciar todo
docker-compose up --build

# Iniciar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (¡borra la BD!)
docker-compose down -v
```

## 🔧 Solución de Problemas

### Error: "Cannot find module '../src/generated/prisma'"
```powershell
npx prisma generate
```

### Error: "Migration failed"
```powershell
# Resetear la base de datos
npx prisma migrate reset

# O forzar una nueva migración
npx prisma migrate dev --name fix --create-only
# Edita el archivo de migración si es necesario
npx prisma migrate dev
```

### Error: "Port 3000 already in use"
```powershell
# En Windows PowerShell, encontrar el proceso
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Matar el proceso (reemplaza PID con el número del proceso)
Stop-Process -Id PID -Force

# O usar otro puerto
$env:PORT=3001; npm run dev
```

### Limpiar caché de Next.js
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

### Reinstalar dependencias
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npx prisma generate
```

## 📊 Verificar Estado

```powershell
# Ver estado de migraciones
npx prisma migrate status

# Validar el schema
npx prisma validate

# Ver versión de Prisma
npx prisma -v

# Ver versión de Node
node -v

# Ver versión de npm
npm -v
```

## 🌐 Despliegue en Vercel

```powershell
# Instalar Vercel CLI globalmente
npm i -g vercel

# Login en Vercel
vercel login

# Desplegar (primera vez)
vercel

# Desplegar a producción
vercel --prod
```

### Variables de entorno en Vercel
Configura estas variables en el dashboard de Vercel:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `BLOB_ENDPOINT`
- `BLOB_ACCESS_KEY_ID`
- `BLOB_SECRET_ACCESS_KEY`
- `BLOB_BUCKET`
- `ADMIN_EMAILS`

## 📝 Comandos de Git

```powershell
# Inicializar repositorio (si no existe)
git init

# Añadir todos los archivos
git add .

# Commit
git commit -m "Initial commit"

# Añadir repositorio remoto
git remote add origin https://github.com/usuario/boda-estelle.git

# Push
git push -u origin main
```

## 🎨 Personalización

### Cambiar el puerto de desarrollo
Crea un archivo `.env.local`:
```env
PORT=3001
```

### Habilitar logs de Prisma
En `.env`:
```env
DEBUG="prisma:*"
```

## 🔒 Seguridad

### Generar un NEXTAUTH_SECRET
```powershell
# Opción 1: Usar OpenSSL (Git Bash en Windows)
openssl rand -base64 32

# Opción 2: Usar Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opción 3: Online
# Visita: https://generate-secret.vercel.app/32
```

## 📚 Recursos

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **TailwindCSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Lucide Icons**: https://lucide.dev/

---

💡 **Tip**: Guarda este archivo como referencia rápida durante el desarrollo.
