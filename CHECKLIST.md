# ✅ Checklist de Configuración - Boda Estelle

## 📋 Antes de Empezar

- [ ] Node.js instalado (versión 20 o superior)
- [ ] Git instalado (para control de versiones)
- [ ] Editor de código (VS Code recomendado)
- [ ] Terminal/PowerShell

## 🗄️ Base de Datos

### Opción 1: PostgreSQL Local
- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `boda_estelle` creada
- [ ] `DATABASE_URL` configurado en `.env`

### Opción 2: Base de Datos en la Nube (Recomendado) ⭐
- [ ] Cuenta creada en [Neon](https://neon.tech) o [Supabase](https://supabase.com)
- [ ] Proyecto PostgreSQL creado
- [ ] Connection string copiado a `.env`

```env
DATABASE_URL="postgresql://user:pass@host/dbname?sslmode=require"
```

## 🔐 Configuración de Seguridad

- [ ] Archivo `.env` creado (copiar desde `.env.example`)
- [ ] `NEXTAUTH_SECRET` generado:
  ```powershell
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- [ ] `NEXTAUTH_URL` configurado (http://localhost:3000 para desarrollo)
- [ ] `ADMIN_EMAILS` configurado con emails de los novios

```env
NEXTAUTH_SECRET="tu-secret-generado-aqui"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAILS="novio@email.com,novia@email.com"
```

## 📦 Instalación

- [ ] Dependencias instaladas:
  ```powershell
  npm install
  ```
- [ ] Cliente de Prisma generado:
  ```powershell
  npx prisma generate
  ```
- [ ] Migraciones aplicadas:
  ```powershell
  npx prisma migrate dev --name init
  ```
- [ ] (Opcional) Datos de ejemplo cargados:
  ```powershell
  npx prisma db seed
  ```

## 🖼️ Almacenamiento de Fotos

### Opción 1: AWS S3
- [ ] Bucket S3 creado
- [ ] IAM user con permisos creado
- [ ] Access Key y Secret Key obtenidos
- [ ] Variables configuradas en `.env`:

```env
BLOB_ENDPOINT="https://s3.amazonaws.com"
BLOB_REGION="us-east-1"
BLOB_ACCESS_KEY_ID="tu-access-key"
BLOB_SECRET_ACCESS_KEY="tu-secret-key"
BLOB_BUCKET="boda-estelle-photos"
```

### Opción 2: Cloudflare R2 (Recomendado) ⭐
- [ ] Cuenta de Cloudflare creada
- [ ] Bucket R2 creado
- [ ] API Token generado
- [ ] Variables configuradas en `.env`:

```env
BLOB_ENDPOINT="https://[account-id].r2.cloudflarestorage.com"
BLOB_REGION="auto"
BLOB_ACCESS_KEY_ID="tu-r2-access-key"
BLOB_SECRET_ACCESS_KEY="tu-r2-secret-key"
BLOB_BUCKET="boda-estelle-photos"
```

### Opción 3: Supabase Storage ⭐
- [ ] Proyecto Supabase creado (puedes usar el mismo para BD)
- [ ] Bucket creado en Storage
- [ ] Service key obtenido
- [ ] Variables configuradas en `.env`

## 📧 Email (Opcional)

Para enviar confirmaciones por email:

### Gmail
- [ ] Contraseña de aplicación generada en Google Account
- [ ] Variables configuradas:

```env
EMAIL_SERVER="smtp://tu-email@gmail.com:tu-app-password@smtp.gmail.com:587"
EMAIL_FROM="noreply@tu-dominio.com"
```

### SendGrid / Resend (Alternativa)
- [ ] Cuenta creada
- [ ] API key obtenido
- [ ] Configuración actualizada en el código

## 🚀 Verificación

- [ ] Servidor de desarrollo inicia sin errores:
  ```powershell
  npm run dev
  ```
- [ ] Aplicación accesible en http://localhost:3000
- [ ] Página de inicio carga correctamente
- [ ] Navegación funciona
- [ ] Prisma Studio abre correctamente:
  ```powershell
  npx prisma studio
  ```

## 🎨 Personalización

- [ ] Información de la boda actualizada en `/informacion`
- [ ] Fecha de la boda actualizada en página de inicio
- [ ] Lugares turísticos agregados (Prisma Studio o seed)
- [ ] Lista de regalos configurada (si aplica)
- [ ] Colores y fuentes ajustados (si es necesario)

## 🧪 Pruebas

- [ ] Formulario RSVP funciona
- [ ] Subida de fotos funciona
- [ ] Sugerencias de música funcionan
- [ ] Reserva de regalos funciona
- [ ] Panel admin accesible en `/admin`
- [ ] Diseño responsive en móvil
- [ ] Animaciones funcionan correctamente

## 🌐 Preparación para Producción

- [ ] Repositorio Git inicializado
- [ ] Código subido a GitHub/GitLab
- [ ] Variables de entorno documentadas
- [ ] README.md personalizado

## 🚢 Despliegue

### Vercel (Recomendado)
- [ ] Cuenta de Vercel creada
- [ ] Repositorio conectado
- [ ] Variables de entorno configuradas en Vercel:
  - [ ] `DATABASE_URL`
  - [ ] `NEXTAUTH_SECRET`
  - [ ] `NEXTAUTH_URL` (URL de producción)
  - [ ] `BLOB_*` (variables de storage)
  - [ ] `ADMIN_EMAILS`
- [ ] Build exitoso
- [ ] Migraciones de Prisma ejecutadas en producción

## 📱 Post-Despliegue

- [ ] Sitio web accesible públicamente
- [ ] Todas las páginas funcionan
- [ ] Subida de fotos funciona en producción
- [ ] Base de datos conectada correctamente
- [ ] SSL/HTTPS habilitado
- [ ] Dominio personalizado configurado (opcional)

## 🎯 Contenido Inicial

- [ ] Lugares turísticos agregados
- [ ] Lista de regalos configurada
- [ ] Información de la boda completada
- [ ] Fotos de prueba eliminadas
- [ ] Datos de ejemplo limpiados (si no son necesarios)

## 📊 Monitoreo

- [ ] Verificar logs de Vercel regularmente
- [ ] Revisar panel de admin para nuevas confirmaciones
- [ ] Aprobar fotos subidas por invitados
- [ ] Aprobar sugerencias de música
- [ ] Monitorear uso de base de datos
- [ ] Monitorear uso de almacenamiento de fotos

## 🎉 Lista para Compartir

- [ ] URL del sitio probada en múltiples dispositivos
- [ ] Invitaciones enviadas con el enlace
- [ ] Instrucciones para invitados preparadas
- [ ] Email de contacto configurado para soporte

## 📝 Notas Importantes

**Seguridad:**
- ⚠️ NUNCA subas el archivo `.env` a Git
- ⚠️ Mantén `NEXTAUTH_SECRET` privado
- ⚠️ Usa contraseñas fuertes para la base de datos

**Performance:**
- ✅ Optimiza imágenes antes de subirlas
- ✅ Configura límites de tamaño para fotos subidas
- ✅ Monitorea el uso de la base de datos

**Mantenimiento:**
- 🔄 Haz backups de la base de datos regularmente
- 🔄 Revisa y aprueba contenido subido por usuarios
- 🔄 Mantén las dependencias actualizadas

## 🆘 Recursos de Ayuda

Si necesitas ayuda, consulta:
- 📖 `README.md` - Documentación completa
- 🚀 `SETUP.md` - Guía de instalación detallada
- 💻 `COMANDOS.md` - Referencia de comandos
- 📊 `RESUMEN.md` - Resumen del proyecto

## ✅ Verificación Final

Una vez completado todo:
- [ ] Sitio funciona en producción
- [ ] Invitados pueden confirmar asistencia
- [ ] Fotos pueden subirse y aprobarse
- [ ] Panel admin accesible solo para administradores
- [ ] Diseño se ve bien en móvil y desktop
- [ ] Todas las secciones están personalizadas

---

## 🎊 ¡Felicidades!

Si has completado todos los ítems, tu sitio web de boda está listo para compartir con tus invitados.

**¡Que disfrutes tu gran día!** 💍✨

---

**Última actualización**: Octubre 2025
