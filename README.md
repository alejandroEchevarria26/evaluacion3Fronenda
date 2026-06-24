# Tortas Kelita - React

Versión moderna y responsive del sitio de Tortas Kelita, migrada desde HTML,
CSS y JavaScript a React 19 con TypeScript y vinext.

## Funciones

- Catálogo generado desde datos tipados en `data/products.ts`.
- Filtros por tortas, regalos y eventos.
- Formulario controlado para registrar productos con `useState`.
- Descripción obligatoria y stock numérico mayor o igual a cero.
- Carga de imagen con validación máxima de 2 MB.
- Contador dinámico y eliminación con confirmación.
- Vista cliente limpia para catálogo, detalles y pedidos.
- Vista administrador con resumen de inventario y gestion de productos.
- Modal accesible con detalles de cada producto.
- Formulario que prepara la solicitud y abre WhatsApp.
- Navegación adaptada a escritorio y teléfono.
- Imágenes locales optimizadas para no depender de servicios externos.

## Ejecutar

Requiere Node.js 22.13 o superior.

```bash
npm run install:ci
npm run dev
```

### Windows PowerShell

Dentro de la carpeta que contiene `package.json`:

```powershell
npm.cmd install
npm.cmd run dev:windows
```

Luego abre `http://localhost:3000` en el navegador. La terminal debe permanecer
abierta mientras usas la página.

Para construir y validar el proyecto:

```bash
npm run build
```

## Configuración de WhatsApp

El formulario usa `https://wa.me/?text=...`, por lo que abre el selector de
contacto de WhatsApp. Para enviarlo siempre al negocio, reemplaza esa URL en
`components/KelitaSite.tsx` por `https://wa.me/569XXXXXXXX?text=...` usando el
número real, sin espacios ni el signo `+`.
