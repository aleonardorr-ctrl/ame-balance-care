# Publicación para Windows

AME Balance Care se distribuye en Windows como una aplicación web progresiva (PWA) gratuita. No requiere un instalador `.exe`: Microsoft Edge y Google Chrome pueden instalarla directamente desde el sitio HTTPS.

## Experiencia del usuario

1. Abrir la URL pública en Edge o Chrome.
2. Seleccionar **Instalar aplicación** en el navegador o usar el botón **Instalar en Windows** de AME Balance Care.
3. Abrir AME Balance Care desde el menú Inicio, la barra de tareas o el acceso directo.

Después de la primera carga, las funciones principales y el historial local permanecen disponibles sin conexión. Los datos se almacenan en el perfil del navegador de ese equipo.

## Validación previa a publicación

- Instalar desde Edge en Windows 10 y Windows 11.
- Confirmar que abre en una ventana independiente y muestra nombre e icono correctos.
- Probar un balance completo conectado y sin conexión.
- Cerrar, abrir desde Inicio y confirmar la persistencia del historial.
- Verificar Excel, Word, impresión/PDF y respaldo JSON.
- Probar español, inglés, portugués y chino simplificado.
- Confirmar que desinstalar la PWA no elimina archivos exportados por el usuario.

## Microsoft Store

La misma PWA puede empaquetarse para Microsoft Store después de que la URL pública y la política de privacidad estén disponibles para cualquier visitante. El paquete debe generarse desde la URL de producción y firmarse con la identidad asignada en Partner Center.

La ficha debe declarar:

- Precio: gratis.
- Sin compras dentro de la aplicación.
- Sin anuncios.
- Sin creación de cuenta obligatoria.
- Datos clínicos procesados y almacenados localmente.
- Herramienta educativa y de apoyo; no diagnostica ni sustituye el juicio clínico.

