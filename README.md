# 💍 Boda Estelle

Aplicación web moderna, elegante y mobile-first para gestionar todos los aspectos de una boda.

## ⚙️ Stack Tecnológico

- **Next.js 15** (App Router, Server Actions, React 19)
- **TypeScript**
- **TailwindCSS** (diseño responsive y mobile-first)
- **Prisma ORM** + **PostgreSQL**
- **NextAuth.js v5** (autenticación con Google + Email)
- **next-intl** (multilenguaje: francés, inglés, español)
- **Framer Motion** (animaciones suaves)
- **lucide-react** (iconos)
- **AWS S3-compatible Blob Storage** (almacenamiento de fotos)

## 🎨 Características

### Diseño
- Estilo romántico, moderno y minimalista
- 100% responsive y mobile-first
- Paleta de colores que cambia automáticamente según la fecha:
  - Enero a marzo → rojo, naranja y azul
  - Abril en adelante → lila y plata
- Fuentes: Playfair Display (títulos) + Inter (textos)
- Animaciones suaves con Framer Motion

### Módulos Principales

1. **Confirmación de Asistencia (RSVP)** (`/rsvp`)
   - Formulario de confirmación con nombre, email, asistencia, acompañantes
   - Comentarios y restricciones alimentarias
   - Notificación por email

2. **Turismo Cercano** (`/turismo`)
   - Lugares recomendados con filtros por categoría
   - Hoteles, restaurantes, ocio y cultura
   - Enlaces a más información

3. **Lista de Regalos** (`/regalos`)
   - Integración con Amazon Gift List
   - Sistema de reserva de regalos
   - Estado: disponible, reservado, comprado

4. **Galería de Fotos** (`/galeria`)
   - Subida de fotos por invitados
   - Almacenamiento en blob propio (S3-compatible)
   - Sistema de aprobación por admin
   - Visualización en masonry grid

5. **Información General** (`/informacion`)
   - Detalles de la ceremonia y ubicación
   - Código de vestimenta y paleta de colores
   - Clima estimado
   - Transporte y aparcamiento

6. **Sugerencias de Música** (`/musica`)
   - Invitados pueden sugerir canciones
   - Sistema de aprobación por admin
   - Lista de canciones confirmadas

7. **Panel de Administración** (`/admin`)
   - Gestión de confirmaciones (RSVPs)
   - Aprobación de fotos
   - Aprobación de canciones
   - Estadísticas en tiempo real

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
cd boda-estelle
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/boda_estelle?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="genera-un-secret-aleatorio"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="tu-google-client-id"
GOOGLE_CLIENT_SECRET="tu-google-client-secret"

# Email
EMAIL_SERVER="smtp://user:password@smtp.gmail.com:587"
EMAIL_FROM="noreply@boda-estelle.com"

# Blob Storage (S3-compatible)
BLOB_ENDPOINT="https://s3.amazonaws.com"
BLOB_REGION="us-east-1"
BLOB_ACCESS_KEY_ID="tu-access-key"
BLOB_SECRET_ACCESS_KEY="tu-secret-key"
BLOB_BUCKET="boda-estelle-photos"

# Admin Emails
ADMIN_EMAILS="admin1@ejemplo.com,admin2@ejemplo.com"
```

### 4. Configurar la base de datos

```bash
# Generar el cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# (Opcional) Seed de datos de ejemplo
npx prisma db seed
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📦 Estructura del Proyecto

```
src/
├── app/
│   ├── (public)/           # Rutas públicas
│   │   ├── rsvp/          # Confirmación de asistencia
│   │   ├── turismo/       # Lugares recomendados
│   │   ├── regalos/       # Lista de regalos
│   │   ├── galeria/       # Galería de fotos
│   │   ├── informacion/   # Información general
│   │   └── musica/        # Sugerencias de música
│   ├── admin/             # Panel de administración
│   ├── api/               # API Routes
│   │   ├── rsvp/
│   │   ├── tourism/
│   │   ├── gifts/
│   │   ├── photos/
│   │   └── songs/
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página de inicio
├── components/
│   ├── ui/                # Componentes UI reutilizables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Textarea.tsx
│   ├── layout/            # Componentes de layout
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeSwitcherByDate.tsx
│   └── ...
├── lib/
│   ├── prisma.ts          # Cliente de Prisma
│   ├── blob.ts            # Gestión de blob storage
│   ├── theme.ts           # Sistema de temas
│   └── utils.ts           # Utilidades
├── hooks/
│   └── useThemeByDate.ts  # Hook de tema dinámico
└── prisma/
    └── schema.prisma      # Schema de base de datos
```

## 🎨 Sistema de Temas

La aplicación cambia automáticamente los colores según la fecha:

- **Enero - Marzo**: Colores cálidos (rojo, naranja, azul)
- **Abril en adelante**: Colores suaves (lila, plata)

Implementado con el hook `useThemeByDate()` y el componente `ThemeSwitcherByDate`.

## 🗄️ Base de Datos

El proyecto usa Prisma con PostgreSQL. Los modelos principales:

- **User**: Usuarios y autenticación
- **RSVP**: Confirmaciones de asistencia
- **TourismPlace**: Lugares turísticos
- **Gift**: Lista de regalos
- **Photo**: Galería de fotos
- **Song**: Sugerencias musicales

### Comandos útiles de Prisma:

```bash
# Ver la base de datos en Prisma Studio
npx prisma studio

# Crear una nueva migración
npx prisma migrate dev --name nombre_migracion

# Generar el cliente después de cambios
npx prisma generate

# Resetear la base de datos (¡cuidado en producción!)
npx prisma migrate reset
```

## 🔒 Seguridad y Administración

El panel de administración (`/admin`) debe protegerse. Los emails de administrador se configuran en la variable `ADMIN_EMAILS` en `.env`.

## 🚢 Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

Asegúrate de configurar las variables de entorno en el dashboard de Vercel.

### Docker (Opcional)

```dockerfile
# Dockerfile incluido en el proyecto
docker build -t boda-estelle .
docker run -p 3000:3000 boda-estelle
```

## 📝 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting
```

## 🌐 Internacionalización (próximamente)

El proyecto está preparado para soportar múltiples idiomas con `next-intl`:
- Español (ES)
- Francés (FR)
- Inglés (EN)

## 🤝 Contribuir

Este es un proyecto privado para una boda. Si tienes sugerencias o encuentras bugs, por favor contacta con los administradores.

## 📄 Licencia

Privado - Todos los derechos reservados © 2025

---

Hecho con ❤️ para una celebración especial
