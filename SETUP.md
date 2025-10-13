# Boda Estelle - Guía de Inicio Rápido

## 🚀 Primeros Pasos

### 1. Configurar Base de Datos PostgreSQL

#### Opción A: Local con PostgreSQL
```powershell
# Instala PostgreSQL si no lo tienes
# Luego crea la base de datos
psql -U postgres
CREATE DATABASE boda_estelle;
\q
```

#### Opción B: Usar Neon, Supabase o Railway
1. Crea una cuenta gratuita en [Neon](https://neon.tech), [Supabase](https://supabase.com) o [Railway](https://railway.app)
2. Crea un nuevo proyecto PostgreSQL
3. Copia la connection string

### 2. Configurar Variables de Entorno

```powershell
# Crea el archivo .env copiando el ejemplo
Copy-Item .env.example .env

# Edita .env con tus valores
notepad .env
```

**Valores mínimos requeridos:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/boda_estelle"
NEXTAUTH_SECRET="ejecuta: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Configurar Blob Storage (para fotos)

#### Opción A: AWS S3
```env
BLOB_ENDPOINT="https://s3.amazonaws.com"
BLOB_REGION="us-east-1"
BLOB_ACCESS_KEY_ID="tu-access-key"
BLOB_SECRET_ACCESS_KEY="tu-secret-key"
BLOB_BUCKET="boda-estelle-photos"
```

#### Opción B: Cloudflare R2
```env
BLOB_ENDPOINT="https://your-account-id.r2.cloudflarestorage.com"
BLOB_REGION="auto"
BLOB_ACCESS_KEY_ID="tu-r2-access-key"
BLOB_SECRET_ACCESS_KEY="tu-r2-secret-key"
BLOB_BUCKET="boda-estelle-photos"
```

#### Opción C: Supabase Storage
```env
BLOB_ENDPOINT="https://your-project.supabase.co/storage/v1/s3"
BLOB_REGION="us-east-1"
BLOB_ACCESS_KEY_ID="tu-supabase-key"
BLOB_SECRET_ACCESS_KEY="tu-supabase-secret"
BLOB_BUCKET="boda-estelle-photos"
```

### 4. Instalar y Configurar

```powershell
# Instalar dependencias
npm install

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# (Opcional) Cargar datos de ejemplo
npx prisma db seed

# Iniciar servidor de desarrollo
npm run dev
```

### 5. Acceder a la Aplicación

- **Aplicación**: http://localhost:3000
- **Prisma Studio** (BD visual): `npx prisma studio`

## 🎯 Tareas Post-Instalación

### 1. Configurar Emails de Admin
En `.env`, añade los emails de los administradores:
```env
ADMIN_EMAILS="novio@email.com,novia@email.com"
```

### 2. Personalizar Información
Edita los siguientes archivos para personalizar:
- `src/app/informacion/page.tsx` - Detalles de la boda
- `src/app/page.tsx` - Página de inicio
- `src/components/layout/Footer.tsx` - Pie de página

### 3. Añadir Lugares Turísticos
Usa Prisma Studio o el panel de admin para añadir lugares:
```bash
npx prisma studio
```

### 4. Configurar Email (opcional)
Para enviar confirmaciones por email:
```env
EMAIL_SERVER="smtp://usuario:contraseña@smtp.gmail.com:587"
EMAIL_FROM="noreply@tu-dominio.com"
```

## 🐛 Solución de Problemas

### Error: "Can't connect to database"
- Verifica que PostgreSQL esté corriendo
- Comprueba la `DATABASE_URL` en `.env`
- Asegúrate de que la base de datos existe

### Error: "Module not found: prisma"
```powershell
npx prisma generate
```

### Error al subir fotos
- Verifica las credenciales de blob storage en `.env`
- Asegúrate de que el bucket existe
- Comprueba los permisos de acceso

### Cambios en schema.prisma no se reflejan
```powershell
npx prisma generate
npx prisma migrate dev
```

## 📚 Recursos Útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de TailwindCSS](https://tailwindcss.com/docs)
- [Documentación de Framer Motion](https://www.framer.com/motion/)

## 🎨 Personalización

### Cambiar Colores
Edita `src/lib/theme.ts` para modificar las paletas de colores.

### Cambiar Fuentes
Edita `src/app/layout.tsx` para usar diferentes fuentes de Google Fonts.

### Añadir Páginas
Crea nuevas carpetas en `src/app/` siguiendo la estructura del App Router de Next.js.

## 📞 Soporte

Si encuentras problemas, revisa:
1. Los logs de la consola
2. Los errores en la terminal
3. La configuración de `.env`
4. Las migraciones de Prisma

---

¡Disfruta construyendo tu aplicación de boda! 💍
