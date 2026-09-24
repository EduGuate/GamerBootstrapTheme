# NeoGamer Hub

Tienda gamer de demostración en español, construida con HTML, Bootstrap 5.3 y JavaScript sin frameworks. Compatible con GitHub Pages y con apertura directa de `index.html`.

## Ejecutar

Abrí `index.html` en tu navegador, o desde esta carpeta ejecutá:

```sh
python -m http.server 8080
```

Luego visitá `http://localhost:8080`. No requiere instalación, compilación, claves ni servicios externos. Los estilos de Bootstrap y todas las ilustraciones SVG están incluidos localmente.

## Funciones

- Seis productos ficticios con fichas y especificaciones.
- Búsqueda por nombre, categoría y características; ignora acentos.
- Filtros por categoría y orden por precio.
- Carrito con cantidades de 1 a 99, eliminación y vaciado.
- Persistencia en localStorage, sincronización entre pestañas y tolerancia a datos inválidos o almacenamiento bloqueado.
- Resumen descargable en texto. Cálculos monetarios en centavos.
- Navegación móvil, diálogos accesibles por teclado, estados vacíos, preguntas frecuentes y respeto por movimiento reducido.

## Personalización

- `assets/app.js`: productos, precios en USD, características y comportamiento.
- `assets/styles.css`: diseño adaptable y colores.
- `assets/*.svg`: ilustraciones vectoriales originales.
- `index.html`: textos, navegación y secciones.
- `assets/bootstrap.min.css`: Bootstrap 5.3.0, licencia MIT; conserva el encabezado del proveedor.

## Alcance

Es un frontend demo: no procesa compras, cobros, envíos ni datos personales. Los productos y precios son ilustrativos. El carrito pertenece al navegador/dispositivo; no es una cuenta de usuario. Para vender realmente se requiere integrar catálogo real, backend, inventario, impuestos, envíos y proveedor de pagos.

## Publicación

El sitio usa rutas relativas para funcionar en `/GamerBootstrapTheme/`. Publicá el contenido de la carpeta raíz mediante GitHub Pages. Los cambios realizados localmente no actualizan la versión pública hasta subirlos al repositorio y completar el despliegue de Pages.

## Validación realizada

Pruebas de navegador Chromium: imágenes locales, seis productos, filtros, búsquedas sin resultados, ordenamiento, fichas, carrito, incremento, eliminación, total en centavos, persistencia tras recargar, descarga, carrito vacío y recuperación de almacenamiento corrupto. Navegación móvil y ausencia de desbordamiento horizontal en 320, 390, 768, 1024 y 1440 px. Sin errores JavaScript durante esos recorridos.

Para una revisión manual, agregá mouse y teclado: el total debe ser USD 189.98. Incrementá el mouse a dos unidades: USD 249.97. Recargá y verificá que se mantengan tres unidades; descargá el resumen y luego vaciá el carrito.
